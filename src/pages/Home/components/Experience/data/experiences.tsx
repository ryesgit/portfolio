interface experience {
    jobTitle: string,
    company: string,
    startDate: string,
    endDate: string,
    description: string[]
}

const experiences: experience[] = [
    {
        jobTitle: "Software Engineering Intern",
        company: "OM.FARM",
        startDate: "January 2024",
        endDate: "Present",
        description: []
    },
    {
        company: "Google Developer Student Clubs",
        jobTitle: "Software Development Subject Matter Expert (SME)",
        startDate: "October 2023",
        endDate: "Present",
        description: []
    },
    {
        jobTitle: "Backend Developer",
        company: "Saphlink",
        startDate: "May 2023",
        endDate: "August 2023",
        description: [
            "First time working with a team.",
            "Built the backend of a calendar application that\
                     integrated Google Calendar and Microsoft Outlook\
                     Calendar using Express.js and MongoDB.",

            "Wrote an automatic email-sending script that takes\
                    a list of emails and sends each a message using\
                    nodemailer, a Node.js module."
        ]
    }
];

export default experiences;