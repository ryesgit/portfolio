import education from "./data/education";
import "./Education.css";

const Education = () => {
  return (
    <section id="education">
        <h1>Education</h1>
        
        {
            education.map((school) => {
                return (
                    <div className="education" key={school.school}>
                        <h2>{school.school}</h2>
                        <h3>{school.degree}</h3>
                        <p>{school.startDate} - {school.endDate}</p>
                    </div>
                )
            })
        }

    </section>
  )
}

export default Education;