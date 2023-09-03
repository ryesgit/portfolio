import experiences from "./data/experiences"
import "./Experience.css";

const Experience = () => {
  return (
    <section id="experience">
        <h2>Experience</h2>
        {    
            experiences.map(experience => {
                return (
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
                )
            })
        }

    </section>
  )
}

export default Experience