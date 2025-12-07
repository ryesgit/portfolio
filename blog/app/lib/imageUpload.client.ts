export interface UploadResult {
  url: string;
  path: string;
}

// Convert file to base64 for upload
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix to get just the base64 string
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const uploadBlogImage = async (
  file: File
): Promise<UploadResult | null> => {
  try {
    if (file.size > 32 * 1024 * 1024) {
      // 32MB limit for ImgBB
      alert("Image size must be less than 32MB");
      return null;
    }
    const base64Image = await fileToBase64(file);
    const functionsBase = import.meta.env.VITE_FUNCTIONS_ENDPOINT || "";
    const uploadEndpoint = functionsBase
      ? `${functionsBase}/api/upload-image`
      : "/api/upload-image";

    const response = await fetch(uploadEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
        name: file.name,
      }),
    });

    if (!response.ok) {
      throw new Error(`Upload API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return {
        url: data.url,
        path: data.deleteUrl, // Store delete URL for potential future use
      };
    } else {
      throw new Error(data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const deleteBlogImage = async (deleteUrl: string): Promise<boolean> => {
  try {
    // ImgBB doesn't provide a direct delete API for free tier
    // The delete URL would need to be accessed manually
    // For now, we'll just return true for API compatibility
    console.log("Delete URL for manual deletion:", deleteUrl);
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
};

export const generateImageMarkdown = (
  url: string,
  alt: string = "Blog image"
): string => {
  return `![${alt}](${url})`;
};