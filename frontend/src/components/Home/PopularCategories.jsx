import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineDesignServices,
  MdOutlineWebhook,
  MdAccountBalance,
  MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";
import { Card, SectionHeader, Badge } from "../UI";
import { Section, Container } from "../UI/Layout";

const PopularCategories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      title: "Graphics & Design",
      count: 305,
      icon: <MdOutlineDesignServices />,
    },
    {
      id: 2,
      title: "Mobile App Development",
      count: 500,
      icon: <TbAppsFilled />,
    },
    {
      id: 3,
      title: "Frontend Web Development",
      count: 200,
      icon: <MdOutlineWebhook />,
    },
    {
      id: 4,
      title: "MERN Stack Development",
      count: 1000,
      icon: <FaReact />,
    },
    {
      id: 5,
      title: "Account & Finance",
      count: 150,
      icon: <MdAccountBalance />,
    },
    {
      id: 6,
      title: "Artificial Intelligence",
      count: 867,
      icon: <GiArtificialIntelligence />,
    },
    {
      id: 7,
      title: "Video Animation",
      count: 50,
      icon: <MdOutlineAnimation />,
    },
    {
      id: 8,
      title: "Game Development",
      count: 80,
      icon: <IoGameController />,
    },
  ];

  return (
    <Section>
      <Container>
        <SectionHeader
          title="Popular Job Categories"
          subtitle="Explore thousands of opportunities across diverse industries"
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-lg group transition-all duration-300"
              onClick={() => navigate("/job/getall")}
            >
              <div className="p-6 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="text-5xl text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>

                {/* Title */}
                <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  {category.title}
                </h4>

                {/* Count Badge */}
                <Badge variant="primary" size="md">
                  {category.count}+ Open Positions
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default PopularCategories;
