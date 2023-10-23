import experiences from "./data/experiences"
import "./Experience.css";

const Experience = () => {
  return (
    <section id="experience">
        <h1>Experience</h1>
        {    
            experiences.map(experience => {
                return (
                    <>
                        <aside id="end-date" className="dates">
                            <div id="dashes"></div>
                            <p>{experience.endDate}</p>
                            <div id="dashes"></div>
                        </aside>
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
                        <aside id="start-date" className="dates">
                            <div id="dashes"></div>
                            <p>{experience.startDate}</p>
                            <div id="dashes"></div>
                        </aside>
                    </>
                )
            })
        }

    </section>
  )
}

export default Experience