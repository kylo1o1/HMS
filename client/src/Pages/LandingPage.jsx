import React from "react";

import Hero from "../Components/Home/Hero";
import FindBySpeciality from "../Components/Home/FindBySpeciality";
import Testimonials from "../Components/Home/Testimonial";
import MedicineSection from "../Components/Home/MedicineSection";


const LandingPage = () => {
  return (
    <div className="landing-Page mx-4 mt-4">
      <Hero/>
      <FindBySpeciality />
      <MedicineSection/>
      <Testimonials/>
    </div>
  );
};

export default LandingPage;
