import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useLoaderData, Link } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const BlogSidebar = ({ posts }) => {
  const categories = Array.from(new Set(posts.map((post) => post.category))).filter(Boolean);
  const allTags = posts.flatMap((post) => post.tags || []);
  const tags = Array.from(new Set(allTags));
  return /* @__PURE__ */ jsxs("aside", { className: "blog-sidebar", children: [
    /* @__PURE__ */ jsxs("div", { className: "sidebar-section", children: [
      /* @__PURE__ */ jsx("h3", { children: "Categories" }),
      /* @__PURE__ */ jsx("ul", { className: "category-list", children: categories.map((category, index) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: `#category-${category.toLowerCase().replace(" ", "-")}`, children: category }) }, index)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "sidebar-section", children: [
      /* @__PURE__ */ jsx("h3", { children: "Tags" }),
      /* @__PURE__ */ jsx("div", { className: "tags-cloud", children: tags.map((tag, index) => /* @__PURE__ */ jsx("span", { className: "tag-cloud-item", children: tag }, index)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "sidebar-section", children: [
      /* @__PURE__ */ jsx("h3", { children: "About" }),
      /* @__PURE__ */ jsxs("p", { children: [
        "I write some of my learnings, reflections, and whatever it may be here. ",
        /* @__PURE__ */ jsx("br", {}),
        "Some of them are coherent, hopefully."
      ] })
    ] })
  ] });
};
const getBlogPostBySlug = async (slug) => {
  try {
    const { initializeApp } = await import("firebase/app");
    const { getFirestore, collection, query, where, getDocs } = await import("firebase/firestore");
    const firebaseConfig = {
      apiKey: "AIzaSyDN4Rw6cp-Eo8en4AY_HAQp2JECw05pV4I",
      authDomain: "blogsite-a43e6.firebaseapp.com",
      projectId: "blogsite-a43e6"
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const q = query(
      collection(db, "blogPosts"),
      where("slug", "==", slug),
      where("published", "==", true)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      publishDate: data.publishDate.toDate().toISOString().split("T")[0],
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      slug: data.slug,
      readTime: data.readTime,
      published: data.published || false
    };
  } catch (error) {
    console.error("Firebase error:", error);
    if (error?.code === "permission-denied") {
      console.error("Firebase permission denied. Check Firestore security rules.");
    }
    return null;
  }
};
const getBlogMetaServer = async () => {
  try {
    const { initializeApp } = await import("firebase/app");
    const { getFirestore, doc, getDoc } = await import("firebase/firestore");
    const firebaseConfig = {
      apiKey: "AIzaSyDN4Rw6cp-Eo8en4AY_HAQp2JECw05pV4I",
      authDomain: "blogsite-a43e6.firebaseapp.com",
      projectId: "blogsite-a43e6"
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const docRef = doc(db, "meta", "settings");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return {
        blogTitle: "Chug Blogs",
        blogDescription: "A modern blog powered by React Router and Firebase",
        blogKeywords: "blog, tech, programming, development",
        authorName: "Lee Ryan Soliman",
        siteUrl: "https://blog.leeryan.dev",
        ogImage: "https://blog.leeryan.dev/og-image.jpg",
        twitterHandle: "@leeryansoliman",
        googleAnalyticsId: "",
        favicon: "/favicon.ico",
        themeColor: "#dc2626"
      };
    }
  } catch (error) {
    console.error("Firebase meta error:", error);
    return null;
  }
};
const meta$2 = ({
  data
}) => {
  const meta2 = data?.meta || {
    blogTitle: "Chug Blogs",
    blogDescription: "A modern blog powered by React Router and Firebase",
    blogKeywords: "blog, tech, programming, development",
    authorName: "Lee Ryan Soliman",
    siteUrl: "https://blog.leeryan.dev",
    ogImage: "https://blog.leeryan.dev/og-image.jpg",
    twitterHandle: "@leeryansoliman",
    themeColor: "#dc2626"
  };
  return [
    {
      title: meta2.blogTitle
    },
    {
      name: "description",
      content: meta2.blogDescription
    },
    {
      name: "keywords",
      content: meta2.blogKeywords
    },
    {
      name: "author",
      content: meta2.authorName
    },
    {
      name: "robots",
      content: "index, follow"
    },
    // Open Graph / Facebook
    {
      property: "og:type",
      content: "website"
    },
    {
      property: "og:title",
      content: meta2.blogTitle
    },
    {
      property: "og:description",
      content: meta2.blogDescription
    },
    {
      property: "og:url",
      content: meta2.siteUrl
    },
    {
      property: "og:site_name",
      content: meta2.blogTitle
    },
    {
      property: "og:image",
      content: meta2.ogImage
    },
    {
      property: "og:image:width",
      content: "1200"
    },
    {
      property: "og:image:height",
      content: "630"
    },
    {
      property: "og:locale",
      content: "en_US"
    },
    // Twitter
    {
      name: "twitter:card",
      content: "summary_large_image"
    },
    {
      name: "twitter:title",
      content: meta2.blogTitle
    },
    {
      name: "twitter:description",
      content: meta2.blogDescription
    },
    {
      name: "twitter:image",
      content: meta2.ogImage
    },
    {
      name: "twitter:creator",
      content: meta2.twitterHandle
    },
    // Additional SEO
    {
      name: "theme-color",
      content: meta2.themeColor
    },
    {
      tagName: "link",
      rel: "canonical",
      href: meta2.siteUrl
    }
  ];
};
async function loader$1() {
  const meta2 = await getBlogMetaServer();
  return {
    meta: meta2
  };
}
const _index = UNSAFE_withComponentProps(function BlogIndex() {
  const {
    meta: meta2
  } = useLoaderData();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const {
          getBlogPosts
        } = await import("./assets/blog.client-DWnBv3Qu.js");
        const fetchedPosts = await getBlogPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx("div", {
      className: "blog-list-container",
      children: /* @__PURE__ */ jsx("div", {
        className: "blog-content",
        children: /* @__PURE__ */ jsx("div", {
          className: "blog-main",
          children: /* @__PURE__ */ jsxs("div", {
            className: "blog-header",
            children: [/* @__PURE__ */ jsx("h1", {
              children: meta2?.blogTitle || "Chug Blogs"
            }), /* @__PURE__ */ jsx("p", {
              children: "Loading posts..."
            })]
          })
        })
      })
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "blog-list-container",
    children: /* @__PURE__ */ jsxs("div", {
      className: "blog-content",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "blog-main",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "blog-header",
          children: [/* @__PURE__ */ jsx("h1", {
            children: meta2?.blogTitle || "Chug Blogs"
          }), /* @__PURE__ */ jsx("p", {
            children: meta2?.blogDescription || "Thoughts on tech, science, life, and everything in between"
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "blog-controls",
          children: /* @__PURE__ */ jsx("input", {
            type: "text",
            placeholder: "Search posts...",
            className: "search-input"
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "blog-posts",
          children: posts.length > 0 ? posts.map((post) => /* @__PURE__ */ jsx(BlogPostCard, {
            post
          }, post.id)) : /* @__PURE__ */ jsxs("div", {
            className: "no-posts",
            children: [/* @__PURE__ */ jsx("h3", {
              children: "No posts found"
            }), /* @__PURE__ */ jsx("p", {
              children: "Try adjusting your search or filter criteria."
            })]
          })
        })]
      }), /* @__PURE__ */ jsx(BlogSidebar, {
        posts
      })]
    })
  });
});
function BlogPostCard({
  post
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  return /* @__PURE__ */ jsxs("article", {
    className: "blog-post-card",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "post-meta",
      children: [/* @__PURE__ */ jsx("span", {
        className: "post-category",
        children: post.category
      }), /* @__PURE__ */ jsx("span", {
        className: "post-date",
        children: formatDate(post.publishDate)
      }), /* @__PURE__ */ jsxs("span", {
        className: "read-time",
        children: [post.readTime, " min read"]
      })]
    }), /* @__PURE__ */ jsx("h2", {
      className: "post-title",
      children: post.title
    }), /* @__PURE__ */ jsx("p", {
      className: "post-excerpt",
      children: post.excerpt
    }), /* @__PURE__ */ jsx("div", {
      className: "post-tags",
      children: post.tags.map((tag, index) => /* @__PURE__ */ jsx("span", {
        className: "tag",
        children: tag
      }, index))
    }), /* @__PURE__ */ jsx(Link, {
      to: `/post/${post.slug}`,
      className: "read-more-btn",
      children: "Read More →"
    })]
  });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index,
  loader: loader$1,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const signInWithGoogle = void 0;
const signOutAdmin = void 0;
const onAuthStateChange = void 0;
function AdminLogin({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      const user = await signInWithGoogle();
      if (user) {
        onLoginSuccess();
      }
    } catch (error2) {
      setError(error2.message);
      console.error("Login error:", error2);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "admin-login", children: /* @__PURE__ */ jsxs("div", { className: "admin-card", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-6 text-center", children: "Admin Login" }),
    /* @__PURE__ */ jsxs("div", { className: "login-content", children: [
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 mb-6 text-center", children: "Please sign in with your authorized Google account to access the admin panel." }),
      error && /* @__PURE__ */ jsx("div", { className: "error-message bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded mb-4", children: error }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleGoogleSignIn,
          disabled: loading,
          className: "google-signin-btn w-full bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3",
          children: [
            /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
              /* @__PURE__ */ jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
              /* @__PURE__ */ jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
              /* @__PURE__ */ jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
            ] }),
            loading ? "Signing in..." : "Sign in with Google"
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "admin-info mt-6 p-4 bg-gray-800/50 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-400 text-center", children: [
        /* @__PURE__ */ jsx("strong", { children: "Admin Access Only:" }),
        " This login is restricted to authorized administrators only. If you're not an admin, you won't be able to access this panel."
      ] }) })
    ] })
  ] }) });
}
function CreatePost({ onBack, onPostCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    slug: "",
    readTime: 1,
    published: false
  });
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };
  const handleTitleChange = (title) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { createBlogPost } = await import("./assets/blog.client-DWnBv3Qu.js");
      const postData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      };
      const postId = await createBlogPost(postData);
      if (postId) {
        toast.success("Post created successfully!");
        onPostCreated();
      } else {
        toast.error("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error creating post. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "blog-header", children: [
      /* @__PURE__ */ jsx("h1", { children: "Create New Post" }),
      /* @__PURE__ */ jsx("p", { children: "Write and publish a new blog post" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsx("button", { onClick: onBack, className: "admin-btn secondary", children: "← Back to Dashboard" }),
      /* @__PURE__ */ jsxs("div", { className: "form-actions-inline", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onBack, className: "admin-btn secondary", children: "Cancel" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            form: "create-post-form",
            disabled: saving,
            className: "admin-btn primary",
            children: saving ? "Creating..." : "Create Post"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "admin-content", children: /* @__PURE__ */ jsxs("form", { id: "create-post-form", onSubmit: handleSubmit, className: "admin-form-stack", children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "Post Content" }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "title", children: "Title *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "title",
              value: formData.title,
              onChange: (e) => handleTitleChange(e.target.value),
              required: true,
              placeholder: "Enter post title"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "slug", children: "Slug" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "slug",
              value: formData.slug,
              onChange: (e) => setFormData((prev) => ({ ...prev, slug: e.target.value })),
              placeholder: "post-url-slug"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "excerpt", children: "Excerpt *" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "excerpt",
              value: formData.excerpt,
              onChange: (e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value })),
              required: true,
              placeholder: "Brief description of the post",
              rows: 3
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxs("div", { className: "content-editor-header", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "content", children: "Content *" }),
            /* @__PURE__ */ jsxs("div", { className: "preview-tabs", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: `tab-btn ${!previewMode ? "active" : ""}`,
                  onClick: () => setPreviewMode(false),
                  children: "Write"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: `tab-btn ${previewMode ? "active" : ""}`,
                  onClick: () => setPreviewMode(true),
                  children: "Preview"
                }
              )
            ] })
          ] }),
          !previewMode ? /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "content",
              value: formData.content,
              onChange: (e) => setFormData((prev) => ({ ...prev, content: e.target.value })),
              required: true,
              placeholder: "Write your post content in Markdown",
              rows: 25,
              style: { minHeight: "500px" }
            }
          ) : /* @__PURE__ */ jsx("div", { className: "markdown-preview", style: { minHeight: "500px" }, children: formData.content ? /* @__PURE__ */ jsx(
            ReactMarkdown,
            {
              remarkPlugins: [remarkGfm, remarkMath],
              rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeRaw],
              components: {
                pre: ({ children, ...props }) => /* @__PURE__ */ jsx("pre", { className: "code-block", ...props, children }),
                code: ({ inline, children, ...props }) => inline ? /* @__PURE__ */ jsx("code", { className: "inline-code", ...props, children }) : /* @__PURE__ */ jsx("code", { ...props, children }),
                blockquote: ({ children, ...props }) => /* @__PURE__ */ jsx("blockquote", { className: "quote", ...props, children }),
                h1: ({ children, ...props }) => /* @__PURE__ */ jsx("h1", { className: "content-h1", ...props, children }),
                h2: ({ children, ...props }) => /* @__PURE__ */ jsx("h2", { className: "content-h2", ...props, children }),
                h3: ({ children, ...props }) => /* @__PURE__ */ jsx("h3", { className: "content-h3", ...props, children }),
                a: ({ children, href, ...props }) => /* @__PURE__ */ jsx(
                  "a",
                  {
                    href,
                    className: "content-link",
                    target: href?.startsWith("http") ? "_blank" : void 0,
                    rel: href?.startsWith("http") ? "noopener noreferrer" : void 0,
                    ...props,
                    children
                  }
                ),
                ul: ({ children, ...props }) => /* @__PURE__ */ jsx("ul", { className: "content-list", ...props, children }),
                ol: ({ children, ...props }) => /* @__PURE__ */ jsx("ol", { className: "content-list ordered", ...props, children }),
                p: ({ children, ...props }) => /* @__PURE__ */ jsx("p", { className: "content-paragraph", ...props, children })
              },
              children: formData.content
            }
          ) : /* @__PURE__ */ jsx("p", { className: "preview-placeholder", children: "Nothing to preview. Start writing in the Write tab to see your content rendered here." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "Post Settings" }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "category", children: "Category" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "category",
              value: formData.category,
              onChange: (e) => setFormData((prev) => ({ ...prev, category: e.target.value })),
              placeholder: "Technology, Science, etc."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "tags", children: "Tags (comma-separated)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "tags",
              value: formData.tags,
              onChange: (e) => setFormData((prev) => ({ ...prev, tags: e.target.value })),
              placeholder: "React, JavaScript, Web Development"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "readTime", children: "Read Time (minutes)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              id: "readTime",
              value: formData.readTime,
              onChange: (e) => setFormData((prev) => ({ ...prev, readTime: parseInt(e.target.value) || 1 })),
              min: "1",
              max: "60"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxs("label", { className: "checkbox-label", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: formData.published,
              onChange: (e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))
            }
          ),
          "Publish immediately"
        ] }) })
      ] })
    ] }) })
  ] });
}
function EditPost({ post, onBack, onPostUpdated }) {
  const [formData, setFormData] = useState({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags,
    slug: post.slug,
    readTime: post.readTime,
    published: post.published || false,
    publishDate: post.publishDate
  });
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };
  const handleTitleChange = (title) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { updateBlogPost } = await import("./assets/blog.client-DWnBv3Qu.js");
      const updateData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      };
      const success = await updateBlogPost(post.id, updateData);
      if (success) {
        toast.success("Post updated successfully!");
        onPostUpdated();
      } else {
        toast.error("Failed to update post. Please try again.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Error updating post. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "blog-header", children: [
      /* @__PURE__ */ jsx("h1", { children: "Edit Post" }),
      /* @__PURE__ */ jsx("p", { children: "Update your blog post content and settings" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsx("button", { onClick: onBack, className: "admin-btn secondary", children: "← Back to Manage Posts" }),
      /* @__PURE__ */ jsxs("div", { className: "form-actions-inline", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onBack, className: "admin-btn secondary", children: "Cancel" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            form: "edit-post-form",
            disabled: saving,
            className: "admin-btn primary",
            children: saving ? "Updating..." : "Update Post"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "admin-content", children: /* @__PURE__ */ jsxs("form", { id: "edit-post-form", onSubmit: handleSubmit, className: "admin-form-stack", children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "Post Content" }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "title", children: "Title *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "title",
              value: formData.title,
              onChange: (e) => handleTitleChange(e.target.value),
              required: true,
              placeholder: "Enter post title"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "slug", children: "Slug" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "slug",
              value: formData.slug,
              onChange: (e) => setFormData((prev) => ({ ...prev, slug: e.target.value })),
              placeholder: "post-url-slug"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "excerpt", children: "Excerpt *" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "excerpt",
              value: formData.excerpt,
              onChange: (e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value })),
              required: true,
              placeholder: "Brief description of the post",
              rows: 3
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxs("div", { className: "content-editor-header", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "content", children: "Content *" }),
            /* @__PURE__ */ jsxs("div", { className: "preview-tabs", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: `tab-btn ${!previewMode ? "active" : ""}`,
                  onClick: () => setPreviewMode(false),
                  children: "Write"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: `tab-btn ${previewMode ? "active" : ""}`,
                  onClick: () => setPreviewMode(true),
                  children: "Preview"
                }
              )
            ] })
          ] }),
          !previewMode ? /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "content",
              value: formData.content,
              onChange: (e) => setFormData((prev) => ({ ...prev, content: e.target.value })),
              required: true,
              placeholder: "Write your post content in Markdown",
              rows: 25,
              style: { minHeight: "500px" }
            }
          ) : /* @__PURE__ */ jsx("div", { className: "markdown-preview", style: { minHeight: "500px" }, children: formData.content ? /* @__PURE__ */ jsx(
            ReactMarkdown,
            {
              remarkPlugins: [remarkGfm, remarkMath],
              rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeRaw],
              components: {
                pre: ({ children, ...props }) => /* @__PURE__ */ jsx("pre", { className: "code-block", ...props, children }),
                code: ({ inline, children, ...props }) => inline ? /* @__PURE__ */ jsx("code", { className: "inline-code", ...props, children }) : /* @__PURE__ */ jsx("code", { ...props, children }),
                blockquote: ({ children, ...props }) => /* @__PURE__ */ jsx("blockquote", { className: "quote", ...props, children }),
                h1: ({ children, ...props }) => /* @__PURE__ */ jsx("h1", { className: "content-h1", ...props, children }),
                h2: ({ children, ...props }) => /* @__PURE__ */ jsx("h2", { className: "content-h2", ...props, children }),
                h3: ({ children, ...props }) => /* @__PURE__ */ jsx("h3", { className: "content-h3", ...props, children }),
                a: ({ children, href, ...props }) => /* @__PURE__ */ jsx(
                  "a",
                  {
                    href,
                    className: "content-link",
                    target: href?.startsWith("http") ? "_blank" : void 0,
                    rel: href?.startsWith("http") ? "noopener noreferrer" : void 0,
                    ...props,
                    children
                  }
                ),
                ul: ({ children, ...props }) => /* @__PURE__ */ jsx("ul", { className: "content-list", ...props, children }),
                ol: ({ children, ...props }) => /* @__PURE__ */ jsx("ol", { className: "content-list ordered", ...props, children }),
                p: ({ children, ...props }) => /* @__PURE__ */ jsx("p", { className: "content-paragraph", ...props, children })
              },
              children: formData.content
            }
          ) : /* @__PURE__ */ jsx("p", { className: "preview-placeholder", children: "Nothing to preview. Start writing in the Write tab to see your content rendered here." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "Post Settings" }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "category", children: "Category" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "category",
              value: formData.category,
              onChange: (e) => setFormData((prev) => ({ ...prev, category: e.target.value })),
              placeholder: "Technology, Science, etc."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "tags", children: "Tags (comma-separated)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "tags",
              value: formData.tags,
              onChange: (e) => setFormData((prev) => ({ ...prev, tags: e.target.value })),
              placeholder: "React, JavaScript, Web Development"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "readTime", children: "Read Time (minutes)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              id: "readTime",
              value: formData.readTime,
              onChange: (e) => setFormData((prev) => ({ ...prev, readTime: parseInt(e.target.value) || 1 })),
              min: "1",
              max: "60"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "publishDate", children: "Publish Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "publishDate",
              value: formData.publishDate,
              onChange: (e) => setFormData((prev) => ({ ...prev, publishDate: e.target.value }))
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxs("label", { className: "checkbox-label", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: formData.published,
              onChange: (e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))
            }
          ),
          "Published"
        ] }) })
      ] })
    ] }) })
  ] });
}
function ManagePosts({ onBack, onEditPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    loadPosts();
  }, []);
  const loadPosts = async () => {
    try {
      const { getAllBlogPosts } = await import("./assets/blog.client-DWnBv3Qu.js");
      const fetchedPosts = await getAllBlogPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }
    try {
      const { deleteBlogPost } = await import("./assets/blog.client-DWnBv3Qu.js");
      await deleteBlogPost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post. Please try again.");
    }
  };
  const handleTogglePublish = async (postId, currentStatus) => {
    try {
      const { togglePublishStatus } = await import("./assets/blog.client-DWnBv3Qu.js");
      await togglePublishStatus(postId, !currentStatus);
      setPosts((prev) => prev.map(
        (post) => post.id === postId ? { ...post, published: !currentStatus } : post
      ));
      toast.success(`Post ${!currentStatus ? "published" : "unpublished"} successfully!`);
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Error updating post status. Please try again.");
    }
  };
  const handleEditPost = (post) => {
    if (onEditPost) {
      onEditPost(post);
    } else {
      toast.info("Edit functionality coming soon!");
    }
  };
  const filteredPosts = posts.filter((post) => {
    if (filter === "published") return post.published;
    if (filter === "draft") return !post.published;
    return true;
  });
  if (loading) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "blog-header", children: [
        /* @__PURE__ */ jsx("h1", { children: "Manage Posts" }),
        /* @__PURE__ */ jsx("p", { children: "Loading posts..." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg", children: /* @__PURE__ */ jsx("button", { onClick: onBack, className: "admin-btn secondary", children: "← Back to Dashboard" }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "blog-header", children: [
      /* @__PURE__ */ jsx("h1", { children: "Manage Posts" }),
      /* @__PURE__ */ jsx("p", { children: "Edit, publish, and manage your blog posts" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsx("button", { onClick: onBack, className: "admin-btn secondary", children: "← Back to Dashboard" }),
      /* @__PURE__ */ jsxs("div", { className: "posts-filter", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: `admin-btn ${filter === "all" ? "primary" : "secondary"}`,
            onClick: () => setFilter("all"),
            children: [
              "All (",
              posts.length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: `admin-btn ${filter === "published" ? "primary" : "secondary"}`,
            onClick: () => setFilter("published"),
            children: [
              "Published (",
              posts.filter((p) => p.published).length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: `admin-btn ${filter === "draft" ? "primary" : "secondary"}`,
            onClick: () => setFilter("draft"),
            children: [
              "Drafts (",
              posts.filter((p) => !p.published).length,
              ")"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "admin-content", children: filteredPosts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "admin-card", children: [
      /* @__PURE__ */ jsx("h3", { children: "No posts found" }),
      /* @__PURE__ */ jsx("p", { children: "No posts match the current filter criteria." })
    ] }) : filteredPosts.map((post) => /* @__PURE__ */ jsxs("div", { className: "admin-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "post-card-header", children: [
        /* @__PURE__ */ jsx("h3", { children: post.title }),
        /* @__PURE__ */ jsx("span", { className: `status ${post.published ? "published" : "draft"}`, children: post.published ? "Published" : "Draft" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "post-meta", children: [
        post.category,
        " • ",
        post.publishDate,
        " • ",
        post.readTime,
        " min read"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "post-excerpt", children: post.excerpt }),
      /* @__PURE__ */ jsxs("div", { className: "admin-actions", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "admin-btn secondary",
            onClick: () => handleEditPost(post),
            children: "Edit"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: `admin-btn ${post.published ? "secondary" : "primary"}`,
            onClick: () => handleTogglePublish(post.id, post.published || false),
            children: post.published ? "Unpublish" : "Publish"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "admin-btn danger",
            onClick: () => handleDeletePost(post.id),
            children: "Delete"
          }
        )
      ] })
    ] }, post.id)) })
  ] });
}
function BlogSettings({ onBack }) {
  const [settings, setSettings] = useState({
    blogTitle: "Chug Blogs",
    blogDescription: "Thoughts on tech, science, life, and everything in between",
    blogKeywords: "blog, tech, programming, development",
    authorName: "Lee Ryan Soliman",
    siteUrl: "https://blog.leeryan.dev",
    ogImage: "https://blog.leeryan.dev/og-image.jpg",
    twitterHandle: "@leeryansoliman",
    googleAnalyticsId: "",
    favicon: "/favicon.ico",
    themeColor: "#dc2626"
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { getBlogMeta } = await import("./assets/blog.client-DWnBv3Qu.js");
        const meta2 = await getBlogMeta();
        if (meta2) {
          setSettings(meta2);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Error loading settings");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { updateBlogMeta } = await import("./assets/blog.client-DWnBv3Qu.js");
      const success = await updateBlogMeta(settings);
      if (success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings. Please try again.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error saving settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "blog-header", children: [
        /* @__PURE__ */ jsx("h1", { children: "Blog Settings" }),
        /* @__PURE__ */ jsx("p", { children: "Loading settings..." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "admin-content", children: /* @__PURE__ */ jsx("div", { className: "admin-card", children: /* @__PURE__ */ jsx("p", { children: "Loading blog settings..." }) }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "blog-header", children: [
      /* @__PURE__ */ jsx("h1", { children: "Blog Settings" }),
      /* @__PURE__ */ jsx("p", { children: "Configure your blog preferences and SEO information" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsx("button", { onClick: onBack, className: "admin-btn secondary", children: "← Back to Dashboard" }),
      /* @__PURE__ */ jsxs("div", { className: "form-actions-inline", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onBack, className: "admin-btn secondary", children: "Cancel" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            form: "blog-settings-form",
            disabled: saving,
            className: "admin-btn primary",
            children: saving ? "Saving..." : "Save Settings"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "admin-content", children: /* @__PURE__ */ jsxs("form", { id: "blog-settings-form", onSubmit: handleSubmit, className: "admin-form-grid", children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "General Settings" }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "blogTitle", children: "Blog Title" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "blogTitle",
              value: settings.blogTitle,
              onChange: (e) => setSettings((prev) => ({ ...prev, blogTitle: e.target.value })),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "blogDescription", children: "Blog Description" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "blogDescription",
              value: settings.blogDescription,
              onChange: (e) => setSettings((prev) => ({ ...prev, blogDescription: e.target.value })),
              rows: 3
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "blogKeywords", children: "Keywords (comma-separated)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "blogKeywords",
              value: settings.blogKeywords,
              onChange: (e) => setSettings((prev) => ({ ...prev, blogKeywords: e.target.value })),
              placeholder: "blog, tech, programming, development"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "authorName", children: "Author Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "authorName",
              value: settings.authorName,
              onChange: (e) => setSettings((prev) => ({ ...prev, authorName: e.target.value })),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "siteUrl", children: "Site URL" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              id: "siteUrl",
              value: settings.siteUrl,
              onChange: (e) => setSettings((prev) => ({ ...prev, siteUrl: e.target.value })),
              required: true,
              placeholder: "https://blog.example.com"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "SEO & Social Media" }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "ogImage", children: "Open Graph Image URL" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              id: "ogImage",
              value: settings.ogImage,
              onChange: (e) => setSettings((prev) => ({ ...prev, ogImage: e.target.value })),
              placeholder: "https://blog.example.com/og-image.jpg"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "twitterHandle", children: "Twitter Handle" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "twitterHandle",
              value: settings.twitterHandle,
              onChange: (e) => setSettings((prev) => ({ ...prev, twitterHandle: e.target.value })),
              placeholder: "@username"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "googleAnalyticsId", children: "Google Analytics ID" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "googleAnalyticsId",
              value: settings.googleAnalyticsId,
              onChange: (e) => setSettings((prev) => ({ ...prev, googleAnalyticsId: e.target.value })),
              placeholder: "G-XXXXXXXXXX"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "favicon", children: "Favicon URL" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "favicon",
              value: settings.favicon,
              onChange: (e) => setSettings((prev) => ({ ...prev, favicon: e.target.value })),
              placeholder: "/favicon.ico"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "themeColor", children: "Theme Color (hex)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "color",
              id: "themeColor",
              value: settings.themeColor,
              onChange: (e) => setSettings((prev) => ({ ...prev, themeColor: e.target.value }))
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
function SEOSettings({ onBack }) {
  const [settings, setSettings] = useState({
    blogTitle: "Chug Blogs",
    blogDescription: "Thoughts on tech, science, life, and everything in between",
    blogKeywords: "blog, tech, programming, development",
    authorName: "Lee Ryan Soliman",
    siteUrl: "https://blog.leeryan.dev",
    ogImage: "https://blog.leeryan.dev/og-image.jpg",
    twitterHandle: "@leeryansoliman",
    googleAnalyticsId: "",
    favicon: "/favicon.ico",
    themeColor: "#dc2626"
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { getBlogMeta } = await import("./assets/blog.client-DWnBv3Qu.js");
        const meta2 = await getBlogMeta();
        if (meta2) {
          setSettings(meta2);
        }
      } catch (error) {
        console.error("Error loading SEO settings:", error);
        toast.error("Error loading SEO settings");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { updateBlogMeta } = await import("./assets/blog.client-DWnBv3Qu.js");
      const success = await updateBlogMeta(settings);
      if (success) {
        toast.success("SEO settings saved successfully!");
      } else {
        toast.error("Failed to save SEO settings. Please try again.");
      }
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      toast.error("Error saving SEO settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "blog-header", children: [
        /* @__PURE__ */ jsx("h1", { children: "SEO Settings" }),
        /* @__PURE__ */ jsx("p", { children: "Loading SEO settings..." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "admin-content", children: /* @__PURE__ */ jsx("div", { className: "admin-card", children: /* @__PURE__ */ jsx("p", { children: "Loading SEO settings..." }) }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "blog-header", children: [
      /* @__PURE__ */ jsx("h1", { children: "SEO Settings" }),
      /* @__PURE__ */ jsx("p", { children: "Optimize your blog for search engines and social media" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsx("button", { onClick: onBack, className: "admin-btn secondary", children: "← Back to Dashboard" }),
      /* @__PURE__ */ jsxs("div", { className: "form-actions-inline", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onBack, className: "admin-btn secondary", children: "Cancel" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            form: "seo-settings-form",
            disabled: saving,
            className: "admin-btn primary",
            children: saving ? "Saving..." : "Save SEO Settings"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "admin-content", children: /* @__PURE__ */ jsxs("form", { id: "seo-settings-form", onSubmit: handleSubmit, className: "admin-form-grid", children: [
      /* @__PURE__ */ jsxs("div", { className: "admin-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "SEO Basics" }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "blogTitle", children: "Blog Title" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "blogTitle",
              value: settings.blogTitle,
              onChange: (e) => setSettings((prev) => ({ ...prev, blogTitle: e.target.value })),
              required: true
            }
          ),
          /* @__PURE__ */ jsx("small", { children: "This appears in search results and browser tabs" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "blogDescription", children: "Blog Description" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "blogDescription",
              value: settings.blogDescription,
              onChange: (e) => setSettings((prev) => ({ ...prev, blogDescription: e.target.value })),
              rows: 3,
              required: true
            }
          ),
          /* @__PURE__ */ jsx("small", { children: "Meta description for search engines (150-160 characters recommended)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "blogKeywords", children: "Keywords" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "blogKeywords",
              value: settings.blogKeywords,
              onChange: (e) => setSettings((prev) => ({ ...prev, blogKeywords: e.target.value })),
              placeholder: "keyword1, keyword2, keyword3"
            }
          ),
          /* @__PURE__ */ jsx("small", { children: "Comma-separated keywords related to your content" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "siteUrl", children: "Site URL" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              id: "siteUrl",
              value: settings.siteUrl,
              onChange: (e) => setSettings((prev) => ({ ...prev, siteUrl: e.target.value })),
              required: true
            }
          ),
          /* @__PURE__ */ jsx("small", { children: "The main URL of your blog" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "authorName", children: "Author Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "authorName",
              value: settings.authorName,
              onChange: (e) => setSettings((prev) => ({ ...prev, authorName: e.target.value })),
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "admin-card", children: [
        /* @__PURE__ */ jsx("h3", { children: "Social Media & Open Graph" }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "ogImage", children: "Open Graph Image URL" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              id: "ogImage",
              value: settings.ogImage,
              onChange: (e) => setSettings((prev) => ({ ...prev, ogImage: e.target.value }))
            }
          ),
          /* @__PURE__ */ jsx("small", { children: "Image shown when your blog is shared on social media (1200x630px recommended)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "twitterHandle", children: "Twitter Handle" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "twitterHandle",
              value: settings.twitterHandle,
              onChange: (e) => setSettings((prev) => ({ ...prev, twitterHandle: e.target.value })),
              placeholder: "@username"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "themeColor", children: "Theme Color" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "color",
              id: "themeColor",
              value: settings.themeColor,
              onChange: (e) => setSettings((prev) => ({ ...prev, themeColor: e.target.value }))
            }
          ),
          /* @__PURE__ */ jsx("small", { children: "Color for mobile browser UI and app theming" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "favicon", children: "Favicon URL" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "favicon",
              value: settings.favicon,
              onChange: (e) => setSettings((prev) => ({ ...prev, favicon: e.target.value })),
              placeholder: "/favicon.ico"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "googleAnalyticsId", children: "Google Analytics ID" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "googleAnalyticsId",
              value: settings.googleAnalyticsId,
              onChange: (e) => setSettings((prev) => ({ ...prev, googleAnalyticsId: e.target.value })),
              placeholder: "G-XXXXXXXXXX"
            }
          ),
          /* @__PURE__ */ jsx("small", { children: "Optional: For tracking website analytics" })
        ] })
      ] })
    ] }) })
  ] });
}
const meta$1 = () => {
  return [{
    title: "Admin - Chug Blogs"
  }, {
    name: "description",
    content: "Admin panel for managing Chug Blogs"
  }, {
    name: "robots",
    content: "noindex, nofollow"
  }];
};
const admin = UNSAFE_withComponentProps(function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");
  const [editingPost, setEditingPost] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const handleLoginSuccess = () => {
  };
  const handleSignOut = async () => {
    try {
      await signOutAdmin();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };
  const handleCreatePost = () => {
    setCurrentView("create-post");
  };
  const handleManagePosts = () => {
    setCurrentView("manage-posts");
  };
  const handleBlogSettings = () => {
    setCurrentView("blog-settings");
  };
  const handleSeoSettings = () => {
    setCurrentView("seo-settings");
  };
  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setEditingPost(null);
  };
  const handleBackToManagePosts = () => {
    setCurrentView("manage-posts");
    setEditingPost(null);
  };
  const handleEditPost = (post) => {
    setEditingPost(post);
    setCurrentView("edit-post");
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", {
      className: "blog-list-container",
      children: /* @__PURE__ */ jsx("div", {
        className: "blog-content",
        children: /* @__PURE__ */ jsx("div", {
          className: "blog-main",
          children: /* @__PURE__ */ jsxs("div", {
            className: "blog-header",
            children: [/* @__PURE__ */ jsx("h1", {
              children: "Loading..."
            }), /* @__PURE__ */ jsx("p", {
              children: "Please wait while we load the admin panel"
            })]
          })
        })
      })
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "blog-list-container",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "blog-content",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "blog-main",
        children: [/* @__PURE__ */ jsx("nav", {
          className: "mb-8",
          children: /* @__PURE__ */ jsx(Link, {
            to: "/",
            className: "inline-flex items-center text-red-400 hover:text-red-500 transition-colors",
            children: "← Back to Blog"
          })
        }), !user?.isAdmin ? /* @__PURE__ */ jsx(AdminLogin, {
          onLoginSuccess: handleLoginSuccess
        }) : /* @__PURE__ */ jsxs(Fragment, {
          children: [currentView === "dashboard" && /* @__PURE__ */ jsxs(Fragment, {
            children: [/* @__PURE__ */ jsxs("div", {
              className: "blog-header",
              children: [/* @__PURE__ */ jsx("h1", {
                children: "Admin Panel"
              }), /* @__PURE__ */ jsx("p", {
                children: "Manage your blog posts and content"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "admin-user-info mb-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg",
              children: [/* @__PURE__ */ jsxs("span", {
                className: "text-gray-300",
                children: ["Welcome, ", user.email]
              }), /* @__PURE__ */ jsx("button", {
                onClick: handleSignOut,
                className: "admin-btn secondary",
                children: "Sign Out"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "admin-content",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "admin-card",
                children: [/* @__PURE__ */ jsx("h2", {
                  children: "Blog Management"
                }), /* @__PURE__ */ jsx("p", {
                  children: "Create, edit, and manage your blog posts."
                }), /* @__PURE__ */ jsxs("div", {
                  className: "admin-actions",
                  children: [/* @__PURE__ */ jsx("button", {
                    onClick: handleCreatePost,
                    className: "admin-btn primary",
                    children: "Create New Post"
                  }), /* @__PURE__ */ jsx("button", {
                    onClick: handleManagePosts,
                    className: "admin-btn secondary",
                    children: "Manage Posts"
                  })]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "admin-card",
                children: [/* @__PURE__ */ jsx("h2", {
                  children: "Settings"
                }), /* @__PURE__ */ jsx("p", {
                  children: "Configure blog settings and preferences."
                }), /* @__PURE__ */ jsxs("div", {
                  className: "admin-actions",
                  children: [/* @__PURE__ */ jsx("button", {
                    onClick: handleBlogSettings,
                    className: "admin-btn secondary",
                    children: "Blog Settings"
                  }), /* @__PURE__ */ jsx("button", {
                    onClick: handleSeoSettings,
                    className: "admin-btn secondary",
                    children: "SEO Settings"
                  })]
                })]
              })]
            })]
          }), currentView === "create-post" && /* @__PURE__ */ jsx(CreatePost, {
            onBack: handleBackToDashboard,
            onPostCreated: handleBackToDashboard
          }), currentView === "manage-posts" && /* @__PURE__ */ jsx(ManagePosts, {
            onBack: handleBackToDashboard,
            onEditPost: handleEditPost
          }), currentView === "edit-post" && editingPost && /* @__PURE__ */ jsx(EditPost, {
            post: editingPost,
            onBack: handleBackToManagePosts,
            onPostUpdated: handleBackToManagePosts
          }), currentView === "blog-settings" && /* @__PURE__ */ jsx(BlogSettings, {
            onBack: handleBackToDashboard
          }), currentView === "seo-settings" && /* @__PURE__ */ jsx(SEOSettings, {
            onBack: handleBackToDashboard
          })]
        })]
      }), /* @__PURE__ */ jsxs("aside", {
        className: "blog-sidebar",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "sidebar-section",
          children: [/* @__PURE__ */ jsx("h3", {
            children: "Quick Actions"
          }), /* @__PURE__ */ jsxs("ul", {
            className: "category-list",
            children: [/* @__PURE__ */ jsx("li", {
              children: /* @__PURE__ */ jsx("a", {
                href: "#new-post",
                children: "New Post"
              })
            }), /* @__PURE__ */ jsx("li", {
              children: /* @__PURE__ */ jsx("a", {
                href: "#drafts",
                children: "Drafts"
              })
            }), /* @__PURE__ */ jsx("li", {
              children: /* @__PURE__ */ jsx("a", {
                href: "#published",
                children: "Published"
              })
            }), /* @__PURE__ */ jsx("li", {
              children: /* @__PURE__ */ jsx("a", {
                href: "#settings",
                children: "Settings"
              })
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "sidebar-section",
          children: [/* @__PURE__ */ jsx("h3", {
            children: "Recent Activity"
          }), /* @__PURE__ */ jsx("p", {
            children: "No recent activity to display."
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx(Toaster, {
      richColors: true,
      position: "top-right"
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: admin,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function getFirstImageFromContent(content) {
  const imageRegex = /!\[.*?\]\((.*?)\)|<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = content.match(imageRegex);
  return match ? match[1] || match[2] : null;
}
const meta = ({
  data
}) => {
  if (!data?.post || !data?.meta) {
    return [{
      title: "Post Not Found - Chug Blogs"
    }, {
      name: "description",
      content: "The requested blog post could not be found."
    }];
  }
  const {
    post,
    meta: meta2
  } = data;
  const seoImage = getFirstImageFromContent(post.content) || meta2.ogImage;
  return [
    {
      title: `${post.title} - ${meta2.blogTitle}`
    },
    {
      name: "description",
      content: post.excerpt
    },
    {
      name: "keywords",
      content: post.tags.join(", ")
    },
    {
      name: "author",
      content: meta2.authorName
    },
    {
      name: "robots",
      content: "index, follow"
    },
    // Open Graph / Facebook
    {
      property: "og:type",
      content: "article"
    },
    {
      property: "og:title",
      content: post.title
    },
    {
      property: "og:description",
      content: post.excerpt
    },
    {
      property: "og:url",
      content: `${meta2.siteUrl}/post/${post.slug}`
    },
    {
      property: "og:site_name",
      content: meta2.blogTitle
    },
    {
      property: "og:image",
      content: seoImage
    },
    {
      property: "og:image:width",
      content: "1200"
    },
    {
      property: "og:image:height",
      content: "630"
    },
    {
      property: "og:locale",
      content: "en_US"
    },
    {
      property: "article:author",
      content: meta2.authorName
    },
    {
      property: "article:published_time",
      content: post.publishDate
    },
    {
      property: "article:section",
      content: post.category
    },
    ...post.tags.map((tag) => ({
      property: "article:tag",
      content: tag
    })),
    // Twitter
    {
      name: "twitter:card",
      content: "summary_large_image"
    },
    {
      name: "twitter:title",
      content: post.title
    },
    {
      name: "twitter:description",
      content: post.excerpt
    },
    {
      name: "twitter:image",
      content: seoImage
    },
    {
      name: "twitter:creator",
      content: meta2.twitterHandle
    },
    // Additional SEO
    {
      name: "theme-color",
      content: meta2.themeColor
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `${meta2.siteUrl}/post/${post.slug}`
    }
  ];
};
async function loader({
  params
}) {
  const {
    slug
  } = params;
  if (!slug) {
    throw new Response("Not Found", {
      status: 404
    });
  }
  try {
    const [post, meta2] = await Promise.all([getBlogPostBySlug(slug), getBlogMetaServer()]);
    if (!post) {
      throw new Response("Not Found", {
        status: 404
      });
    }
    return {
      post,
      meta: meta2
    };
  } catch (error) {
    console.error("Error loading post:", error);
    throw new Response("Not Found", {
      status: 404
    });
  }
}
const post_$slug = UNSAFE_withComponentProps(function BlogPost() {
  const {
    post
  } = useLoaderData();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  return /* @__PURE__ */ jsx("div", {
    className: "blog-list-container",
    children: /* @__PURE__ */ jsxs("div", {
      className: "blog-content",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "blog-main",
        children: [/* @__PURE__ */ jsx("nav", {
          className: "mb-8",
          children: /* @__PURE__ */ jsx(Link, {
            to: "/",
            className: "inline-flex items-center text-red-400 hover:text-red-500 transition-colors",
            children: "← Back to Blog"
          })
        }), /* @__PURE__ */ jsxs("article", {
          className: "blog-post",
          children: [/* @__PURE__ */ jsxs("header", {
            className: "post-header",
            children: [/* @__PURE__ */ jsx("div", {
              className: "category-badge",
              children: /* @__PURE__ */ jsx("span", {
                className: "category",
                children: post.category
              })
            }), /* @__PURE__ */ jsx("h1", {
              className: "post-title",
              children: post.title
            }), /* @__PURE__ */ jsxs("div", {
              className: "post-meta",
              children: [/* @__PURE__ */ jsx("time", {
                dateTime: post.publishDate,
                className: "post-date",
                children: formatDate(post.publishDate)
              }), /* @__PURE__ */ jsxs("span", {
                className: "post-read-time",
                children: [post.readTime, " min read"]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "post-excerpt",
              children: /* @__PURE__ */ jsx("p", {
                children: post.excerpt
              })
            }), post.tags && post.tags.length > 0 && /* @__PURE__ */ jsx("div", {
              className: "post-tags",
              children: post.tags.map((tag, index) => /* @__PURE__ */ jsx("span", {
                className: "tag",
                children: tag
              }, index))
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "post-content",
            children: /* @__PURE__ */ jsx(ReactMarkdown, {
              remarkPlugins: [remarkGfm, remarkMath],
              rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeRaw],
              components: {
                pre: ({
                  children,
                  ...props
                }) => /* @__PURE__ */ jsx("pre", {
                  className: "code-block",
                  ...props,
                  children
                }),
                code: ({
                  children,
                  ...props
                }) => /* @__PURE__ */ jsx("code", {
                  className: "inline-code",
                  ...props,
                  children
                }),
                blockquote: ({
                  children,
                  ...props
                }) => /* @__PURE__ */ jsx("blockquote", {
                  className: "quote",
                  ...props,
                  children
                }),
                h1: ({
                  children,
                  ...props
                }) => /* @__PURE__ */ jsx("h1", {
                  className: "content-h1",
                  ...props,
                  children
                }),
                h2: ({
                  children,
                  ...props
                }) => /* @__PURE__ */ jsx("h2", {
                  className: "content-h2",
                  ...props,
                  children
                }),
                h3: ({
                  children,
                  ...props
                }) => /* @__PURE__ */ jsx("h3", {
                  className: "content-h3",
                  ...props,
                  children
                }),
                a: ({
                  children,
                  href,
                  ...props
                }) => /* @__PURE__ */ jsx("a", {
                  href,
                  className: "content-link",
                  target: href?.startsWith("http") ? "_blank" : void 0,
                  rel: href?.startsWith("http") ? "noopener noreferrer" : void 0,
                  ...props,
                  children
                }),
                ul: ({
                  children,
                  ...props
                }) => /* @__PURE__ */ jsx("ul", {
                  className: "content-list",
                  ...props,
                  children
                }),
                ol: ({
                  children,
                  ...props
                }) => /* @__PURE__ */ jsx("ol", {
                  className: "content-list ordered",
                  ...props,
                  children
                }),
                p: ({
                  children,
                  ...props
                }) => /* @__PURE__ */ jsx("p", {
                  className: "content-paragraph",
                  ...props,
                  children
                })
              },
              children: post.content
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs("aside", {
        className: "blog-sidebar",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "sidebar-section",
          children: [/* @__PURE__ */ jsx("h3", {
            children: "About This Post"
          }), /* @__PURE__ */ jsxs("ul", {
            className: "post-details",
            children: [/* @__PURE__ */ jsxs("li", {
              children: [/* @__PURE__ */ jsx("strong", {
                children: "Published:"
              }), " ", formatDate(post.publishDate)]
            }), /* @__PURE__ */ jsxs("li", {
              children: [/* @__PURE__ */ jsx("strong", {
                children: "Category:"
              }), " ", post.category]
            }), /* @__PURE__ */ jsxs("li", {
              children: [/* @__PURE__ */ jsx("strong", {
                children: "Read Time:"
              }), " ", post.readTime, " minutes"]
            })]
          })]
        }), post.tags && post.tags.length > 0 && /* @__PURE__ */ jsxs("div", {
          className: "sidebar-section",
          children: [/* @__PURE__ */ jsx("h3", {
            children: "Tags"
          }), /* @__PURE__ */ jsx("div", {
            className: "sidebar-tags",
            children: post.tags.map((tag, index) => /* @__PURE__ */ jsx("span", {
              className: "sidebar-tag",
              children: tag
            }, index))
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "sidebar-section",
          children: [/* @__PURE__ */ jsx("h3", {
            children: "Navigation"
          }), /* @__PURE__ */ jsxs("ul", {
            className: "category-list",
            children: [/* @__PURE__ */ jsx("li", {
              children: /* @__PURE__ */ jsx(Link, {
                to: "/",
                children: "← All Posts"
              })
            }), /* @__PURE__ */ jsx("li", {
              children: /* @__PURE__ */ jsx("a", {
                href: "#top",
                children: "↑ Back to Top"
              })
            })]
          })]
        })]
      })]
    })
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: post_$slug,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-kIcmPs6f.js", "imports": ["/assets/chunk-OIYGIGL5-CC10qnHu.js", "/assets/index-DNy3t6UW.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-Ot8a10mp.js", "imports": ["/assets/chunk-OIYGIGL5-CC10qnHu.js", "/assets/index-DNy3t6UW.js"], "css": ["/assets/root-DIN8bCQ3.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-CcyTIOgz.js", "imports": ["/assets/preload-helper-BXl3LOEh.js", "/assets/chunk-OIYGIGL5-CC10qnHu.js"], "css": ["/assets/blog-CunseU0i.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin": { "id": "routes/admin", "parentId": "root", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/admin-TG1xeUES.js", "imports": ["/assets/chunk-OIYGIGL5-CC10qnHu.js", "/assets/index-DNy3t6UW.js", "/assets/firebase.client-BqOXwYna.js", "/assets/preload-helper-BXl3LOEh.js", "/assets/katex.min-DaXZ5bPm.js"], "css": ["/assets/admin-RaJiuU2v.css", "/assets/blog-CunseU0i.css", "/assets/katex-CyAuISp2.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/post.$slug": { "id": "routes/post.$slug", "parentId": "root", "path": "post/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/post._slug-DiEolG9k.js", "imports": ["/assets/chunk-OIYGIGL5-CC10qnHu.js", "/assets/katex.min-DaXZ5bPm.js", "/assets/firebase.client-BqOXwYna.js"], "css": ["/assets/blog-CunseU0i.css", "/assets/katex-CyAuISp2.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-3f751bec.js", "version": "3f751bec", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/admin": {
    id: "routes/admin",
    parentId: "root",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/post.$slug": {
    id: "routes/post.$slug",
    parentId: "root",
    path: "post/:slug",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
