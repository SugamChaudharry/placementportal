import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrosoft, FaApple } from "react-icons/fa";
import { SiTesla } from "react-icons/si";
import { Card, Button, Badge, SectionHeader } from "../UI";
import { Section, Container } from "../UI/Layout";
import { FaMapMarkerAlt } from "react-icons/fa";

const PopularCompanies = () => {
  const navigate = useNavigate();

  const companies = [
    {
      id: 1,
      title: "Microsoft",
      location: "Millennium City Centre, Gurugram",
      openPositions: 10,
      icon: <FaMicrosoft />,
    },
    {
      id: 2,
      title: "Tesla",
      location: "Millennium City Centre, Gurugram",
      openPositions: 5,
      icon: <SiTesla />,
    },
    {
      id: 3,
      title: "Apple",
      location: "Millennium City Centre, Gurugram",
      openPositions: 20,
      icon: <FaApple />,
    },
  ];

  return (
    <Section className="bg-neutral-50 dark:bg-neutral-900">
      <Container>
        <SectionHeader
          title="Top Hiring Companies"
          subtitle="Work with industry leaders and innovative companies"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card
              key={company.id}
              className="hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="text-5xl text-primary-600 dark:text-primary-400">
                    {company.icon}
                  </div>
                  <Badge variant="success" size="sm">
                    Hiring
                  </Badge>
                </div>

                {/* Company Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    {company.title}
                  </h3>
                  <div className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                    <FaMapMarkerAlt className="mr-2 text-primary-600 dark:text-primary-400" />
                    {company.location}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {company.title} is hiring talented professionals across multiple departments. Join our growing team of innovators.
                  </p>
                </div>

                {/* CTA Button */}
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => navigate("/job/getall")}
                >
                  View {company.openPositions}+ Open Positions
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default PopularCompanies;
