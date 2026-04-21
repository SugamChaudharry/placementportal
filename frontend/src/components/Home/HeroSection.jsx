import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaBriefcase, FaUsers, FaUserPlus } from "react-icons/fa";
import { Button } from "../UI";

const HeroSection = () => {
  const navigate = useNavigate();

  const stats = [
    {
      id: 1,
      title: "1,23,441",
      subTitle: "Live Jobs",
      icon: <FaBriefcase />,
    },
    {
      id: 2,
      title: "91,220",
      subTitle: "Companies",
      icon: <FaBuilding />,
    },
    {
      id: 3,
      title: "2,34,200",
      subTitle: "Job Seekers",
      icon: <FaUsers />,
    },
    {
      id: 4,
      title: "1,03,761",
      subTitle: "Employers",
      icon: <FaUserPlus />,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-primary-50 dark:from-neutral-900 to-primary-100 dark:to-neutral-800">
      <div className="container-base py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 dark:text-white mb-4 leading-tight">
                Find a job that suits <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">your interests</span> and skills
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400">
                Discover job opportunities that match your skills and passions. Connect with employers seeking talent like yours for rewarding careers.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/job/getall")}
              >
                Browse Jobs
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/jobseekers")}
              >
                Find Talent
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-accent-200 dark:from-primary-900 dark:to-accent-900 rounded-2xl opacity-30 blur-3xl" />
            <img
              src="/heroS.jpg"
              alt="Hero"
              className="relative w-full h-auto rounded-2xl shadow-2xl object-cover"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow text-center"
            >
              <div className="flex justify-center mb-3 text-primary-600 dark:text-primary-400 text-2xl">
                {stat.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-1">
                {stat.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {stat.subTitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
