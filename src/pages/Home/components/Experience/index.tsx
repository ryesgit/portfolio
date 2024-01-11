import experiences from "./data/experiences"
import "./Experience.css";

const Experience = () => {
    return (
        <section id="experience">
            <h1>Experiences</h1>
            {
                experiences.map((experience, index) => {
                    return (
                        <>
                            <div className="experience" key={experience.company}>
                                <h2>{experience.company}</h2>
                                <h3>{experience.jobTitle}</h3>
                                <p>{experience.startDate} - {experience.endDate}</p>

                                <ul>
                                    {
                                        experience.description.map((description, index) => {
                                            return (
                                                <li key={index}>
                                                    {description}
                                                </li>
                                            )
                                        })
                                    }

                                </ul>
                            </div>
                            {
                                // Do not apply border to last experience element
                                index != experiences.length - 1 &&
                                <div style={{ border: "1px solid indianred", height: "2px" }}></div>
                            }
                        </>
                    )
                })
            }

        </section>
    )
}

export default Experience