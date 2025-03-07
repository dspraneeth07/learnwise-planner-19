
import Header from "@/components/Header";
import StudyPlan from "@/components/StudyPlan";

const GeneratedPlan = () => {
  return (
    <div className="min-h-screen pb-20">
      <Header />
      <div className="pt-24 md:pt-28">
        <div className="container mx-auto">
          <StudyPlan />
        </div>
      </div>
    </div>
  );
};

export default GeneratedPlan;
