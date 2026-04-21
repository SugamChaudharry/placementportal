import React from "react";
import { FaUserPlus, FaCheckCircle } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { Card, SectionHeader } from "../UI";
import { Section, Container } from "../UI/Layout";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <FaUserPlus />,
      title: "Create Account",
      description:
        "Sign up and create your professional profile in minutes. Showcase your skills, experience, and qualifications to get noticed by employers.",
    },
    {
      id: 2,
      icon: <MdFindInPage />,
      title: "Find a Job / Post a Job",
      description:
        "Browse thousands of job opportunities or post your own job listings. Use advanced filters to find the perfect match for your needs.",
    },
    {
      id: 3,
      icon: <IoMdSend />,
      title: "Apply / Recruit Candidates",
      description:
        "Apply for jobs with one click or review applications from qualified candidates. Build relationships with top talent or ideal employers.",
    },
    {
      id: 4,
      icon: <FaCheckCircle />,
      title: "Get Hired / Hire Talent",
      description:
        "Secure your dream job or onboard the perfect candidate. Start your journey to success on CareerConnect today.",
    },
  ];

  return (
    <Section className="bg-neutral-50 dark:bg-neutral-900">
      <Container>
        <SectionHeader
          title="How CareerConnect Works"
          subtitle="Your journey to career success in 4 simple steps"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary-500 to-transparent" />
              )}

              {/* Card */}
              <Card className="h-full flex flex-col">
                <div className="flex-1 p-6">
                  {/* Step Number */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center text-white font-bold text-lg mb-4">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div className="text-4xl text-primary-600 dark:text-primary-400 mb-4">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default HowItWorks;
