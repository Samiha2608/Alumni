-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2025 at 08:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alumni_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `password`) VALUES
(1, 'Samiha@gmail.com', '$2b$10$KIX/Nm5P2cS2j00ZmMKrgecJSZ4NTnvcAsXK/6odtDkh9mSIZW0l6'),
(2, 'SamihaShahzad@gmail.com', 'Samiha123'),
(3, 'Nabiha@gmail.com', '$2b$10$nrLm3gs7u8BhxBVYMdN5T.29BC99blBujlJstGP6zxCT66BFoWam.'),
(4, 'Ali@gmail.com', '$2b$10$kOiwI3ADxCXDg6VSrd5DYeB.BxxN4prPhWtk2GRs2E4dgiakIJNoy'),
(5, 'Azma@gmail.com', '$2b$10$N9QqIGgV7Af/Bl6w6LMH0et0V0jX7dGxGqv40OB1rJG0QciuGD5iS'),
(6, 'Hifza@gmail.com', '$2b$10$/zEXMhV/aQmvRkrA5lyOvuiwLUyTNB.S/H4bf05bBq65IzjrxgJIq');

-- --------------------------------------------------------

--
-- Table structure for table `alumni`
--

CREATE TABLE `alumni` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `graduationYear` int(11) NOT NULL,
  `degree` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `jobStatus` enum('Employed','Unemployed','Freelancer') NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `jobLevel` enum('Junior','Mid','Senior') DEFAULT NULL,
  `phoneNo` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alumni`
--

INSERT INTO `alumni` (`id`, `name`, `graduationYear`, `degree`, `email`, `jobStatus`, `company`, `jobLevel`, `phoneNo`) VALUES
(8, 'Samiha Shahzad', 2024, 'BS Software Engineering', 'Samiha@gmail.com', 'Freelancer', 'I2c', 'Senior', '1234567'),
(10, 'John Doe', 2018, 'Master of Business Administration', 'alicesmith@email.com', 'Unemployed', 'Alice Consulting', 'Junior', '+1 987-654-3210'),
(11, 'Michael Johnson', 2022, 'Bachelor of Arts in Marketing', 'michael.j@email.com', 'Employed', 'Amazon', 'Senior', ' +1 555-789-1234'),
(13, 'Samiha', 2025, 'Bachelor of Software Engineering', 'shahzadsamiha@gmail.com', 'Employed', 'Tech Innovations Inc', 'Junior', '555-123-4567');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `location` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `status` enum('Upcoming','Ongoing','Completed','Cancelled') NOT NULL DEFAULT 'Upcoming',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `date`, `location`, `type`, `status`, `created_at`) VALUES
(8, 'Sports Gala', '2025-03-13', 'Main Library', 'Sports Event', 'Upcoming', '2025-03-09 14:07:54'),
(9, 'Recruitment Seminar', '2025-03-10', 'Chemical department', 'Recruitment Drive', 'Ongoing', '2025-03-09 14:08:40'),
(10, 'Mushaira', '2025-03-12', 'Main Library KSK', 'Poetry event', 'Upcoming', '2025-03-09 14:09:22'),
(31, 'Tech Summit', '2024-07-15', 'New York', 'Confernce', 'Upcoming', '2025-04-08 12:25:46'),
(32, 'Summer Hackathon', '2025-08-20', 'San Fransico', 'Hackathon', 'Ongoing', '2025-04-08 12:25:46'),
(33, 'Alumni Meetup', '2025-09-10', 'chicago', 'Networking', 'Upcoming', '2025-04-08 12:25:46'),
(34, 'Last day', '2025-03-26', 'uet lahore', 'last day', 'Ongoing', '2025-04-08 12:25:46');

-- --------------------------------------------------------

--
-- Table structure for table `forum_posts`
--

CREATE TABLE `forum_posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `replies` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Active','Reported','Closed') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forum_posts`
--

INSERT INTO `forum_posts` (`id`, `title`, `author`, `category`, `replies`, `created_at`, `status`) VALUES
(3, 's', 's', 'Industry News', 0, '2025-03-08 19:37:58', 'Active'),
(4, 'xcvbnnm', 'cvnm', 'Career Advice', 0, '2025-03-09 09:48:00', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `job`
--

CREATE TABLE `job` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `employment_type` enum('Full-time','Part-time','Contract') NOT NULL,
  `experience_level` enum('Entry-level','Mid-level','Senior') NOT NULL,
  `application_deadline` date DEFAULT NULL,
  `posted_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Active','Closed') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job`
--

INSERT INTO `job` (`id`, `title`, `company`, `location`, `description`, `salary`, `employment_type`, `experience_level`, `application_deadline`, `posted_date`, `status`) VALUES
(8, 'React developer', 'CureMD', 'Lahore', 'We are looking for a skilled React Developer to join our team. As a React Developer, you will be responsible for building and maintaining user-friendly web applications. You should have a strong command of React.js and JavaScript, along with experience in state management, component-based architecture, and modern web development best practices.\n\nKey Responsibilities:\nDevelop and maintain scalable, high-performance web applications using React.js.\nBuild reusable components and front-end libraries for future use.\nOptimize applications for maximum speed and scalability.\nCollaborate with designers, backend developers, and stakeholders to deliver high-quality solutions.\nImplement responsive designs and ensure cross-browser compatibility.\nWrite clean, efficient, and well-documented code.\nDebug and troubleshoot technical issues as they arise.\nStay up-to-date with the latest React.js and front-end development trends.\nRequired Skills & Qualifications:\nProficiency in React.js, JavaScript (ES6+), HTML, and CSS.\nStrong understanding of React hooks, functional components, and state management (Redux, Context API, or Recoil).\nExperience with React Router for navigation and routing.\nKnowledge of RESTful APIs and asynchronous programming using fetch or Axios.\nFamiliarity with version control systems like Git and GitHub.\nExperience with UI frameworks/libraries such as Tailwind CSS, Material-UI, or Bootstrap (preferred).\nUnderstanding of unit testing and debugging (Jest, React Testing Library, etc.).\nExperience with build tools like Webpack, Vite, or Parcel (preferred).\nStrong problem-solving skills and attention to detail.\nPreferred Qualifications:\nExperience with Next.js for server-side rendering (SSR) and static site generation (SSG).\nFamiliarity with backend technologies like Node.js, Express, or Firebase.\nKnowledge of CI/CD pipelines and DevOps practices.\nPrior experience working in an Agile/Scrum environment.\nBenefits:\nCompetitive salary and performance-based incentives.\nFlexible working hours and remote work options.\nOpportunity to work with a talented and innovative team.\nLearning and growth opportunities with the latest technologies.\nIf you are passionate about front-end development and enjoy working in a dynamic environment, we’d love to hear from you! Apply now and be part of our growing team.', 500000.00, 'Part-time', 'Mid-level', '2025-03-25', '2025-03-09 14:43:13', 'Active'),
(9, 'Mern stack developer', 'Stack360', 'Lahore', 'We are seeking a talented MERN Stack Developer to join our team. You will be responsible for developing and maintaining full-stack applications using MongoDB, Express.js, React.js, and Node.js. The ideal candidate should have hands-on experience with front-end and back-end development, API integration, and database management.\n\nKey Responsibilities:\nDevelop and maintain high-performance web applications using the MERN stack.\nDesign and implement RESTful APIs using Node.js and Express.js.\nBuild dynamic and responsive UI components using React.js and modern front-end frameworks.\nManage database operations using MongoDB and Mongoose.\nEnsure application security, authentication, and authorization using JWT or OAuth.\nOptimize applications for maximum performance and scalability.\nCollaborate with designers, backend developers, and stakeholders to build user-centric applications.\nDebug, troubleshoot, and resolve technical issues.\nWork with Git and version control for efficient code management.\nStay updated with the latest technologies and best practices in MERN stack development.\nRequired Skills & Qualifications:\nStrong proficiency in JavaScript (ES6+) and asynchronous programming.\nHands-on experience with React.js, including React hooks, Redux, and Context API.\nBackend development expertise using Node.js and Express.js.\nExperience with MongoDB, Mongoose, and database design principles.\nKnowledge of RESTful APIs, WebSockets, and third-party API integration.\nExperience with authentication methods (JWT, OAuth, Firebase Auth).\nFamiliarity with front-end styling frameworks like Tailwind CSS, Bootstrap, or Material-UI.\nExperience with Git, GitHub, and CI/CD pipelines.\nUnderstanding of deployment strategies using Docker, AWS, Vercel, or Netlify (preferred).\nAbility to write clean, scalable, and maintainable code.\nStrong problem-solving skills and attention to detail.\nPreferred Qualifications:\nExperience with Next.js for SSR and static site generation.\nKnowledge of GraphQL and Apollo Client (optional).\nFamiliarity with Agile development methodologies.\nPrior experience working with real-time applications (e.g., Socket.io).\nBenefits:\nCompetitive salary and performance-based incentives.\nFlexible working hours and remote work options.\nWork on exciting and challenging projects with a talented team.\nOpportunities for career growth and skill development.\nIf you\'re a passionate MERN Stack Developer eager to work in a dynamic environment, we\'d love to hear from you! Apply now and be a part of our innovative team.\n\n', 600000.00, 'Contract', 'Mid-level', '2025-03-18', '2025-03-09 14:44:48', 'Active'),
(15, 'Software Engineer', 'Tech Corp', 'New York', 'Exciting role', 90000.00, 'Full-time', 'Mid-level', '2025-05-15', '2025-04-08 12:39:31', 'Active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `alumni`
--
ALTER TABLE `alumni`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `forum_posts`
--
ALTER TABLE `forum_posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job`
--
ALTER TABLE `job`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `alumni`
--
ALTER TABLE `alumni`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `forum_posts`
--
ALTER TABLE `forum_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `job`
--
ALTER TABLE `job`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
