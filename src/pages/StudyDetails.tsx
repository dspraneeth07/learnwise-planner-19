
import Header from "@/components/Header";
import StudyDetailsForm from "@/components/StudyDetailsForm";

const StudyDetails = () => {
  return (
    <div className="min-h-screen pb-20">
      <Header />
      <div className="pt-24 md:pt-28">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Create Your Study Plan</h1>
          <StudyDetailsForm />
        </div>
      </div>
    </div>
  );
};

export default StudyDetails;
