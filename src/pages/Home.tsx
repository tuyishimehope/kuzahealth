import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Section from "../components/layout/Section";
import SectionHeader from "../components/layout/SectionHeader";
import Button from "../components/common/Button";
import ServiceCard from "../components/layout/ServiceCard";
import ContactForm from "../components/layout/ContactForm";
import ContactInfoCard from "../components/layout/ContactInfoCard";

// Import assets
import heroVideo from "../assets/health101.mp4";
import aboutImage from "../assets/image 43.png";
import vaccinationImage from "../assets/vaccinations.png";
import socialImage from "../assets/social-service.png";
import nutritionImage from "../assets/nutrition.png";
import ctnImage from "../assets/ctn.png";
import { useNavigate } from "react-router-dom";

/**
 * Home page component with sections for hero, about, services, etc.
 */
const Home = () => {
  const navigate = useNavigate();

  // Services data
  const services = [
    {
      id: "vaccinations",
      image: vaccinationImage,
      title: "Vaccinations",
      description:
        "Immunization is a key step in protecting both mothers and children from life-threatening diseases. We provide access to vital vaccines that safeguard against preventable illnesses, ensuring healthier pregnancies and stronger starts for newborns.",
      link: "/services/vaccinations",
    },
    {
      id: "social",
      image: socialImage,
      title: "Social Services",
      description:
        "We understand that comprehensive care goes beyond medical treatment. Our social services offer support to mothers and families in need, addressing critical issues such as mental health, childcare, and access to healthcare.",
      link: "/services/social",
    },
    {
      id: "nutrition",
      image: nutritionImage,
      title: "Nutrition",
      description:
        "Proper nutrition is essential for the well-being of both mothers and children. Our nutrition services focus on educating families about healthy eating practices, ensuring access to nutrient-rich foods, and providing supplementation when necessary.",
      link: "/services/nutrition",
    },
  ];

  return (
    <div className="font-sans bg-gray-50">
      {/* Hero Section */}
      <Section
        id="home"
        paddingY="py-0"
        className="relative h-screen w-full overflow-hidden py-56"
        fullWidth
      >
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-black/40"></div>
        </div>

        {/* Navigation */}
        <Navbar />

        {/* Hero Content */}
        <div className="container mx-auto px-6 lg:px-8 relative z-10 h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 mb-2">
              <span className="text-white font-medium text-sm">
                Maternal & Child Healthcare
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight">
              A Path to Healthier Futures
            </h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
              Our mission is to reduce maternal and child mortality by raising
              awareness, improving healthcare access, and providing essential
              education. Together, we can ensure every mother and child receives
              the care they need for a healthier, safer future.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => navigate("/auth/signin")}
              >
                Get Started
              </Button>
              <button className="flex items-center px-6 py-4 text-white hover:text-purple-200 transition-colors duration-300">
                <span className="mr-2">Learn more</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </Section>

      {/* Partners Section */}
      <Section background="white" paddingY="py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Trusted by Leading Organizations
          </h2>
          <div className="w-20 h-1 bg-purple-500 mx-auto rounded-full"></div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {["Company A", "Company B", "Company C", "Company D"].map(
            (company) => (
              <div
                key={company}
                className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
              >
                <span className="text-xl font-bold text-gray-500 hover:text-purple-600 transition-colors">
                  {company}
                </span>
              </div>
            )
          )}
        </div>
      </Section>

      {/* About us Section */}
      <Section id="about" background="gradient">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium mb-2">
              Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              Health Services for Your Well-being
            </h2>
            <div className="w-20 h-1 bg-purple-500 rounded-full"></div>
            <p className="text-gray-600 leading-relaxed">
              We provide an extensive array of health services designed to cater
              to your unique health needs.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              At HealVritue, we are dedicated to improving maternal and child
              health outcomes by leveraging technology and innovative solutions.
              Our goal is to provide essential resources, education, and support
              to healthcare providers and communities to help reduce preventable
              deaths. By collaborating with experts and using data-driven
              approaches, we aim to create a sustainable impact in the fight
              against maternal and child mortality, ensuring that every mother
              and child has the opportunity to thrive.
            </p>
            <div className="pt-4">
              <Button
                variant="primary"
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Explore Our Services
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              <img
                src={aboutImage}
                alt="About Us"
                className="relative rounded-xl shadow-lg w-full object-cover max-w-md mx-auto lg:max-w-full"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Services Section */}
      <Section id="services" background="light">
        <SectionHeader
          badge="What We Offer"
          title="Our Services"
          subtitle="Comprehensive healthcare solutions focused on maternal and child well-being"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              image={service.image}
              title={service.title}
              description={service.description}
              link={service.link}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="primary"
            size="lg"
            className="bg-purple-600 hover:bg-purple-700"
          >
            View All Services
          </Button>
        </div>
      </Section>

      {/* Call to Action Section */}
      <Section id="cta" background="white">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium">
              Join HealVirtue
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              Every life matters,
              <br />
              Every child thrives.
            </h2>
            <div className="w-20 h-1 bg-purple-500 rounded-full"></div>
            <p className="text-xl text-gray-600 italic">
              Care • Listen • Learn • Repeat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              <img
                src={ctnImage}
                alt="Call to Action"
                className="relative rounded-xl shadow-lg w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section
        id="contact"
        background="primary"
        className="relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <SectionHeader
          title="Contact Our Team"
          subtitle="Let us know how we can help. We're here to answer your questions."
          titleSize="default"
          className="text-white"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          <div className="space-y-6">
            <ContactInfoCard
              title="Call Us"
              description="Our team is available Mon-Fri, 9am to 5pm"
              detail="+250 78 999 9999"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              }
            />
            <ContactInfoCard
              title="Visit Us"
              description="Chat with us in person at our office"
              detail="Kigali, Rwanda"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
            />
            <ContactInfoCard
              title="Email Us"
              description="Send us an email anytime"
              detail="contact@healvirtue.com"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default Home;
