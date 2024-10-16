import Button from "../components/Button";
import NavBar from "../components/NavBar";
import about from "../assets/image 43.png";
import vaccination from "../assets/vaccinations.png";
import ctn from "../assets/ctn.png";
import video from "../assets/video-hero.mp4";
import social from "../assets/social-service.png"
import nutrition from "../assets/nutrition.png"
const Home = () => {
  return (
    <div>
      <div
        className=" relative h-screen w-full bg-heroVdeo bg-center"
        id="Home"
      >
        <video
          autoPlay
          muted
          loop
          className="absolute z-100 inset-0 w-full h-screen object-cover"
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <NavBar />
        {/* <div className=" absolute z-10 flex-col space-y-10 px-10 py-10 w-content mt-[25vh] ">
          <h1 className="text-6xl text-green-900 font-bold">
            A Path to Healthier Futures
          </h1>
          <p className="text-green-900 text-2xl">
            Our mission is to reduce maternal and child mortality by raising
            awareness, <br />
            improving healthcare access, and providing essential education.
            Together,
            <br /> we can ensure every mother and child receives the care they
            need for a healthier, safer future.
          </p>
          <Button
            name="Read More"
            className="bg-btnHero hover:bg-purple-500 px-8 py-3 rounded-full text-white"
          />
        </div> */}
      </div>
      <div className="partnersm flex-col items-center justify-center py-6 space-y-4">
        <p className="items-center text-center text-2xl font-bold">Partners</p>
        <ul className="flex  space-x-6 items-center justify-center">
          <li>Company A</li>
          <li>Company B</li>
          <li>Company C</li>
          <li>Company D</li>
        </ul>
      </div>
      <div className="Aboutus flex justify-between items-center space-y-4 bg-[F4F8FF] px-4 py-2">
        <div className="w-[50vw] ">
          <div className="bg-purple-600 text-blue-600 bg-opacity-25 rounded-full w-fit px-4 py-2">
            <p>Our Mission</p>
          </div>
          <div className="space-y-4 mt-4">
            <p className="font-semibold">Health Services for Your Well-being</p>
            <p className="font-light">
              We provide an extensive array of health services designed to cater
              your unique health needs
            </p>
            <p className="font-normal min-2xl:text-2xl ">
              At HealVritue, we are dedicated to improving maternal and child
              health outcomes by leveraging technology and innovative solutions.
              Our goal is to provide essential resources, education, and support
              to healthcare provid ers and communities to help reduce
              preventable deaths. By collaborating with experts and using
              data-driven approaches, we aim to create a sustainable impact in
              the fight against maternal and child mortality, ensuring that
              every mother and child has the opportunity to thrive.
            </p>
            <Button
              name="More Services "
              className="text-white bg-purple-600 px-6 py-2 rounded-full"
            />
          </div>
        </div>
        <div className="w-[50vw]">
          <img src={about} alt="about" />
        </div>
      </div>
      <div className="services m-4 my-8" id="service">
        <p className="text-center font-bold text-xl underline pb-10">
          Our Services
        </p>
        <div className="flex px-30 space-x-6 max-sm:flex-col max-sm:space-y-6 max-sm:justify-center">
          <div className="bg-gray-200 rounded-md bg-opacity-40 ">
            <img src={vaccination} alt="vaccination" className="h-80 w-full object-cover"/>
            <div className="py-6 px-4">
              <p className="py-4 text-xl">Vaccinations</p>
              <p className="text-md">
                Immunization is a key step in protecting both mothers and
                children from life-threatening diseases. We provide access to
                vital vaccines that safeguard against preventable illnesses,
                ensuring healthier pregnancies and stronger starts for newborns.{" "}
              </p>
            </div>
          </div>
          <div className="bg-gray-200 rounded-md bg-opacity-40 ">
            <img src={social} alt="vaccination" className="h-80 w-full object-cover"/>
            <div className="py-6 px-4">
              <p className="py-4 text-xl">Social Services</p>
              <p className="text-md">
              We understand that comprehensive care goes beyond medical treatment. Our social services offer support to mothers and families in need, addressing critical issues such as mental health, childcare, and access to healthcare. {" "}
              </p>
            </div>
          </div>
          <div className="bg-gray-200 rounded-md bg-opacity-40 ">
            <img src={nutrition} alt="vaccination" className="h-80 w-full object-cover"/>
            <div className="py-6 px-4">
              <p className="py-4 text-xl">Nutrition</p>
              <p className="text-md">
              Proper nutrition is essential for the well-being of both mothers and children. Our nutrition services focus on educating families about healthy eating practices, ensuring access to nutrient-rich foods, and providing supplementation when necessary. {" "}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="ctn flex space-x-6 justify-between items-center m-4 mx-10">
        <div className="pt-10 space-y-6">
          <p>Join HealVirtue</p>
          <p className="text-4xl">Every life matters, Every child thrives.</p>
          <p>Care . listen . learn . Repeat</p>
          <Button
            name="Get Started"
            className="bg-purple-500 text-white px-4 py-2 rounded-md"
          />
        </div>
        <div className="w-[50vw]">
          <img src={ctn} alt="ctn" />
        </div>
      </div>
      <div className="contact my-10 bg-bgContact py-20" id="contact">
        <div className="space-y-2 text-white">
          <p className="text-center text-4xl">Contact Our Team</p>
          <p className="text-center text-xl">Let us know how we can help.</p>
        </div>
        <div className="flex justify-between space-y-6 px-10 py-10  bg-opacity-65 max-sm:flex-col">
          <div className="space-y-8">
            <div>
              <div className="flex flex-col space-y-4">
                <label htmlFor="Email" className="text-white">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="bg-gray-300 bg-opacity-15 rounded-full px-8 py-4 text-white placeholder:text-white"
                />
              </div>
            </div>
            <div>
              <div className="flex flex-col space-y-4">
                <label htmlFor="message" className="text-white">
                  Message
                </label>
                <input
                  type="message"
                  placeholder="Enter Your Message"
                  className="bg-gray-300 bg-opacity-15 rounded-full px-8 py-4 text-white placeholder:text-white"
                />
              </div>
            </div>
            <Button
              name="Submit"
              className="bg-btnHero w-full px-6 py-3 text-white rounded-full mt-6"
            />
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-md">
              <p className="font-bold text-2xl">Call Us</p>
              <p>Call our team mon-fri from 9am to 5 pm</p>
              <p>078999999999</p>
            </div>
            <div className="bg-white p-4 rounded-md">
              <p className="font-bold text-2xl">Visit Us</p>
              <p>Chat to us in person at our office</p>
              <p>kigali,kigali,rw</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="flex space-x-4 justify-between p-10">
        <div className="w-[50vw] space-y-4">
          <p className="text-bold text-xl">Health Care</p>
          <p>
            we are dedicated to improving maternal and child health outcomes by
            leveraging technology and innovative solutions. Our goal is to
            provide essential resources, education, and support to healthcare
            providers and communities to help reduce preventable deaths. By
            collaborating with experts and using data-driven approaches, we aim
            to create a sustainable impact in the fight against maternal and
            child mortality, ensuring that every mother and child has the
            opportunity to thrive.
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-bold text-xl">Solution</p>
          <ul className="space-y-4">
            <li>Schedules</li>
            <li>Contacting</li>
            <li>Counselling</li>
            <li>Notification</li>
          </ul>
        </div>
        <div className="space-y-4">
          <p className="text-bold text-xl">Links</p>
          <ul className="space-y-4">
            <li>Home</li>
            <li>Services</li>
            <li>Dashboard</li>
            <li>Sign In</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Home;
