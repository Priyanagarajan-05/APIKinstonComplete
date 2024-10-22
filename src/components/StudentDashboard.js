/* student details are displayed
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email'); // Assuming you saved email in localStorage
    const userId = localStorage.getItem('userId'); // Assuming you saved userId in localStorage
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
        fetchMyCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5295/api/Courses'); // Update endpoint as necessary
            setCourses(response.data);
        } catch (err) {
            console.error('Error fetching courses:', err);
        }
    };

    const fetchMyCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5295/api/Students/my-courses');
            setMyCourses(response.data);
        } catch (err) {
            console.error('Error fetching my courses:', err);
        }
    };

    const handlePurchase = async (courseId) => {
        try {
            await axios.post(`http://localhost:5295/api/Students/purchase/${courseId}`);
            alert("Course purchased successfully!");
            fetchMyCourses(); // Refresh my courses after purchase
        } catch (err) {
            console.error('Error purchasing course:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <div>
            <h2>Student Dashboard</h2>
            <p>Welcome, {username}</p>
            <p>Email: {email}</p>
            <p>User ID: {userId}</p>
            <button onClick={handleLogout}>Logout</button>

            <h3>Available Courses</h3>
            <ul>
                {courses.map((course) => (
                    course.IsApproved && (
                        <li key={course.courseId}>
                            <h4>{course.title}</h4>
                            <p>Start Date: {course.startDate}</p>
                            <p>End Date: {course.endDate}</p>
                            <p>Price: ${course.price}</p>
                            <button onClick={() => handlePurchase(course.courseId)}>Buy</button>
                        </li>
                    )
                ))}
            </ul>

            <h3>My Courses</h3>
            <ul>
                {myCourses.map((course) => (
                    <li key={course.courseId}>
                        <h4>{course.title}</h4>
                        <button onClick={() => navigate(`/my-courses/${course.courseId}`)}>View Modules</button>
                    </li>
                ))}
            </ul>

            <h3>Completed Courses</h3>
            
        </div>
    );
};

// Add additional components for module viewing, rating, and certificate download as needed.

export default StudentDashboard;
*/


/* all coures are displayed 
* but the studnet details are not displayed
* when buy is clickd it shows the course id purchased

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const [studentDetails, setStudentDetails] = useState(null);
    const [courses, setCourses] = useState([]);
    const [purchaseStatus, setPurchaseStatus] = useState(null);

    useEffect(() => {
        // Fetch student details by username
        const fetchStudentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5295/api/Students/details/${username}`);
                setStudentDetails(response.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            }
        };

        // Fetch approved courses
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5295/api/Courses/approved');
                setCourses(response.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchStudentDetails();
        fetchCourses();
    }, [username]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    const handleBuyCourse = (courseId) => {
        // Handle course purchase (you can implement the purchase logic)
        setPurchaseStatus(`You have successfully purchased the course with ID: ${courseId}`);
    };

    return (
        <div>
            <h2>Student Dashboard</h2>
            {studentDetails ? (
                <>
                    <p>Name: {studentDetails.name}</p>
                    <p>Email: {studentDetails.email}</p>
                    <p>User ID: {studentDetails.userId}</p>
                </>
            ) : (
                <p>Loading student details...</p>
            )}

            <button onClick={handleLogout}>Logout</button>

            <h3>Available Courses</h3>
            {courses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.courseId}>
                                <td>{course.title}</td>
                                <td>{course.startDate}</td>
                                <td>{course.endDate}</td>
                                <td>{course.price}</td>
                                <td>
                                    <button onClick={() => handleBuyCourse(course.courseId)}>
                                        Buy
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No approved courses available at the moment.</p>
            )}

            {purchaseStatus && <p>{purchaseStatus}</p>}
        </div>
    );
};

export default StudentDashboard;
*/


/* -- only student details displayed


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const [studentDetails, setStudentDetails] = useState(null); // Store student details
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/');
    };

    useEffect(() => {
        // Fetch student details by email
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email'); // Assuming email is stored in localStorage
                const response = await axios.get(`http://localhost:5295/api/Students/details/${email}`);
                setStudentDetails(response.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchStudentDetails();
    }, []);

    if (loading) {
        return <p>Loading student details...</p>; // Display loading message while fetching
    }

    if (!studentDetails) {
        return <p>No student details found.</p>; // Display message if no details are found
    }

    return (
        <div>
            <h2>Student Dashboard</h2>
            <p>Welcome, {studentDetails.name}</p>
            <p>Email: {studentDetails.email}</p>
            <p>User ID: {studentDetails.userId}</p>
            <button onClick={handleLogout}>Logout</button>
            {}
        </div>
    );
};

export default StudentDashboard;
*/


/* -- in this student details are displayed
* -- course are displayed but the courses title are not displaye
* -- when buy is clicked then it is not showing the course id 

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const [studentDetails, setStudentDetails] = useState(null); // Store student details
    const [courses, setCourses] = useState([]); // Store list of courses
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleBuyCourse = (courseId) => {
        alert("Course bought successfully!");
        // Logic to handle course purchase (e.g., update the database)
    };

    useEffect(() => {
        // Fetch student details by email
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email'); // Assuming email is stored in localStorage
                const studentResponse = await axios.get(`http://localhost:5295/api/Students/details/${email}`);
                setStudentDetails(studentResponse.data);

                // Fetch all courses with IsApproved status 1
                const coursesResponse = await axios.get('http://localhost:5295/api/Courses/approved'); // Assuming this endpoint returns approved courses
                setCourses(coursesResponse.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchStudentDetails();
    }, []);

    if (loading) {
        return <p>Loading student details...</p>; // Display loading message while fetching
    }

    if (!studentDetails) {
        return <p>No student details found.</p>; // Display message if no details are found
    }

    return (
        <div>
            <h2>Student Dashboard</h2>
            <p>Welcome, {studentDetails.name}</p>
            <p>Email: {studentDetails.email}</p>
            <p>User ID: {studentDetails.userId}</p>
            <button onClick={handleLogout}>Logout</button>

            <h3>Available Courses</h3>
            <div>
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course.courseId} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                            <h4>{course.courseName}</h4>
                            <p>{course.description}</p>
                            <p>Start Date: {new Date(course.startDate).toLocaleDateString()}</p>
                            <p>End Date: {new Date(course.endDate).toLocaleDateString()}</p>
                            <p>Price: ${course.price}</p>
                            <button onClick={() => handleBuyCourse(course.courseId)}>Buy</button>
                        </div>
                    ))
                ) : (
                    <p>No approved courses available.</p>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
*/


















/* ======================================= working perfectly ================= course is bought =========================


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const [studentDetails, setStudentDetails] = useState(null); // Store student details
    const [courses, setCourses] = useState([]); // Store courses
    const [purchaseStatus, setPurchaseStatus] = useState(null); // Purchase status message
    const [loading, setLoading] = useState(true); // Loading state for both student and courses
    const navigate = useNavigate();

    // Fetch student details by username
    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email'); // Assuming email is stored in localStorage
                const studentResponse = await axios.get(`http://localhost:5295/api/Students/details/${email}`);
                setStudentDetails(studentResponse.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            } finally {
                setLoading(false); // Set loading to false after fetching student details
            }
        };

        // Fetch approved courses
        const fetchCourses = async () => {
            try {
                const courseResponse = await axios.get('http://localhost:5295/api/Courses/approved');
                setCourses(courseResponse.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        // Fetch both student details and courses
        fetchStudentDetails();
        fetchCourses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleBuyCourse = (courseId) => {
        // Handle course purchase logic
        setPurchaseStatus(`You have successfully purchased the course with ID: ${courseId}`);
    };

    if (loading) {
        return <p>Loading student details and courses...</p>;
    }

    return (
        <div>
            <h2>Student Dashboard</h2>

            {}
            {studentDetails ? (
                <>
                    <p>Name: {studentDetails.name}</p>
                    <p>Email: {studentDetails.email}</p>
                    <p>User ID: {studentDetails.userId}</p>
                </>
            ) : (
                <p>No student details found.</p>
            )}

            <button onClick={handleLogout}>Logout</button>

            {}
            <h3>Available Courses</h3>
            {courses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.courseId}>
                                <td>{course.title}</td> {}
                                <td>{course.description}</td> {}
                                <td>{new Date(course.startDate).toLocaleDateString()}</td>
                                <td>{new Date(course.endDate).toLocaleDateString()}</td>
                                <td>{course.price}</td>
                                <td>
                                    <button onClick={() => handleBuyCourse(course.courseId)}>
                                        Buy
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No approved courses available at the moment.</p>
            )}

            {}
            {purchaseStatus && <p>{purchaseStatus}</p>}
        </div>
    );
};

export default StudentDashboard;
*/


/* ====== can buy course , cant read the course , completed course is working

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const [studentDetails, setStudentDetails] = useState(null);
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [purchaseStatus, setPurchaseStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentCourseId, setCurrentCourseId] = useState(null);
    const navigate = useNavigate();

    // Fetch student details and approved courses
    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email');
                const studentResponse = await axios.get(`http://localhost:5295/api/Students/details/${email}`);
                setStudentDetails(studentResponse.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCourses = async () => {
            try {
                const courseResponse = await axios.get('http://localhost:5295/api/Courses/approved');
                setCourses(courseResponse.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchStudentDetails();
        fetchCourses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleBuyCourse = async (courseId) => {
        const enrollment = { StudentId: studentDetails.userId, CourseId: courseId };
        try {
            await axios.post('http://localhost:5295/api/Enrollments', enrollment);
            setMyCourses((prev) => [...prev, { courseId }]);
            setPurchaseStatus(`You have successfully purchased the course with ID: ${courseId}`);
        } catch (err) {
            console.error("Error enrolling in the course:", err);
        }
    };

    const handleModuleNavigation = (courseId) => {
        setCurrentCourseId(courseId);
        setCurrentModuleIndex(0);
    };

    const handleNextModule = () => {
        setCurrentModuleIndex((prevIndex) => prevIndex + 1);
    };

    const handleFinishCourse = async (courseId) => {
        const completedCourse = myCourses.find(course => course.courseId === courseId);
        if (completedCourse) {
            setCompletedCourses((prev) => [...prev, completedCourse]);
            setMyCourses((prev) => prev.filter(course => course.courseId !== courseId));
        }
    };

    if (loading) {
        return <p>Loading student details and courses...</p>;
    }

    return (
        <div>
            <h2>Student Dashboard</h2>

            {studentDetails ? (
                <>
                    <p>Name: {studentDetails.name}</p>
                    <p>Email: {studentDetails.email}</p>
                    <p>User ID: {studentDetails.userId}</p>
                </>
            ) : (
                <p>No student details found.</p>
            )}

            <button onClick={handleLogout}>Logout</button>

            <h3>Available Courses</h3>
            {courses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.courseId}>
                                <td>{course.title}</td>
                                <td>{course.description}</td>
                                <td>{new Date(course.startDate).toLocaleDateString()}</td>
                                <td>{new Date(course.endDate).toLocaleDateString()}</td>
                                <td>{course.price}</td>
                                <td>
                                    <button onClick={() => handleBuyCourse(course.courseId)}>
                                        Buy
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No approved courses available at the moment.</p>
            )}

            {purchaseStatus && <p>{purchaseStatus}</p>}

            <h3>My Courses</h3>
            {myCourses.length > 0 ? (
                <ul>
                    {myCourses.map((course) => (
                        <li key={course.courseId}>
                            <button onClick={() => handleModuleNavigation(course.courseId)}>
                                Course ID: {course.courseId}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No courses enrolled.</p>
            )}

            {currentCourseId && (
                <div>
                    <h3>Course Modules</h3>
                    <h4>Module {currentModuleIndex + 1}</h4>
                    <p>Content for Module {currentModuleIndex + 1}</p> {}

                    <button onClick={handleNextModule} disabled={currentModuleIndex >= 4}>Next Module</button>
                    {currentModuleIndex >= 4 && (
                        <button onClick={() => handleFinishCourse(currentCourseId)}>
                            Finish Course
                        </button>
                    )}
                </div>
            )}

            <h3>Completed Courses</h3>
            {completedCourses.length > 0 ? (
                <ul>
                    {completedCourses.map((course) => (
                        <li key={course.courseId}>
                            Course ID: {course.courseId}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No completed courses.</p>
            )}
        </div>
    );
};

export default StudentDashboard;

*/


/* ----- download cerificate missing -----

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const [studentDetails, setStudentDetails] = useState(null);
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [purchaseStatus, setPurchaseStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentCourseId, setCurrentCourseId] = useState(null);
    const [currentCourseModules, setCurrentCourseModules] = useState([]);
    const navigate = useNavigate();

    // Fetch student details and approved courses
    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email');
                const studentResponse = await axios.get(`http://localhost:5295/api/Students/details/${email}`);
                setStudentDetails(studentResponse.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCourses = async () => {
            try {
                const courseResponse = await axios.get('http://localhost:5295/api/Courses/approved');
                setCourses(courseResponse.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchStudentDetails();
        fetchCourses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleBuyCourse = async (courseId) => {
        const enrollment = { StudentId: studentDetails.userId, CourseId: courseId };
        try {
            await axios.post('http://localhost:5295/api/Enrollments', enrollment);
            setMyCourses((prev) => [...prev, { courseId }]);
            setPurchaseStatus(`You have successfully purchased the course with ID: ${courseId}`);
        } catch (err) {
            console.error("Error enrolling in the course:", err);
        }
    };

    const handleModuleNavigation = async (courseId) => {
        setCurrentCourseId(courseId);
        setCurrentModuleIndex(0);
        // Fetch modules for the selected course
        try {
            const modulesResponse = await axios.get(`http://localhost:5295/api/Modules/course/${courseId}`);
            setCurrentCourseModules(modulesResponse.data);
        } catch (err) {
            console.error("Error fetching modules:", err);
        }
    };

    const handleNextModule = () => {
        setCurrentModuleIndex((prevIndex) => prevIndex + 1);
    };

    const handleFinishCourse = async (courseId) => {
        const completedCourse = myCourses.find(course => course.courseId === courseId);
        if (completedCourse) {
            setCompletedCourses((prev) => [...prev, completedCourse]);
            setMyCourses((prev) => prev.filter(course => course.courseId !== courseId));
            setCurrentCourseId(null); // Reset current course
            setCurrentModuleIndex(0); // Reset module index
            setCurrentCourseModules([]); // Clear current modules
        }
    };

    if (loading) {
        return <p>Loading student details and courses...</p>;
    }

    return (
        <div>
            <h2>Student Dashboard</h2>

            {studentDetails ? (
                <>
                    <p>Name: {studentDetails.name}</p>
                    <p>Email: {studentDetails.email}</p>
                    <p>User ID: {studentDetails.userId}</p>
                </>
            ) : (
                <p>No student details found.</p>
            )}

            <button onClick={handleLogout}>Logout</button>

            <h3>Available Courses</h3>
            {courses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.courseId}>
                                <td>{course.title}</td>
                                <td>{course.description}</td>
                                <td>{new Date(course.startDate).toLocaleDateString()}</td>
                                <td>{new Date(course.endDate).toLocaleDateString()}</td>
                                <td>{course.price}</td>
                                <td>
                                    <button onClick={() => handleBuyCourse(course.courseId)}>
                                        Buy
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No approved courses available at the moment.</p>
            )}

            {purchaseStatus && <p>{purchaseStatus}</p>}

            <h3>My Courses</h3>
            {myCourses.length > 0 ? (
                <ul>
                    {myCourses.map((course) => (
                        <li key={course.courseId}>
                            <button onClick={() => handleModuleNavigation(course.courseId)}>
                                Course ID: {course.courseId}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No courses enrolled.</p>
            )}

            {currentCourseId && currentCourseModules.length > 0 && (
                <div>
                    <h3>Course Modules</h3>
                    {currentModuleIndex < currentCourseModules.length ? (
                        <>
                            <h4>Module {currentModuleIndex + 1}</h4>
                            <p>{currentCourseModules[currentModuleIndex].content}</p>
                            <button onClick={handleNextModule} disabled={currentModuleIndex >= currentCourseModules.length - 1}>
                                Next Module
                            </button>
                            {currentModuleIndex === currentCourseModules.length - 1 && (
                                <button onClick={() => handleFinishCourse(currentCourseId)}>
                                    Finish Course
                                </button>
                            )}
                        </>
                    ) : (
                        <p>You have completed all modules for this course.</p>
                    )}
                </div>
            )}

            <h3>Completed Courses</h3>
            {completedCourses.length > 0 ? (
                <ul>
                    {completedCourses.map((course) => (
                        <li key={course.courseId}>
                            Course ID: {course.courseId}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No completed courses.</p>
            )}
        </div>
    );
};

export default StudentDashboard;
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const StudentDashboard = () => {
    const [studentDetails, setStudentDetails] = useState(null);
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [purchaseStatus, setPurchaseStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentCourseId, setCurrentCourseId] = useState(null);
    const [currentCourseModules, setCurrentCourseModules] = useState([]);
    const navigate = useNavigate();

    // Fetch student details and approved courses
    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email');
                const studentResponse = await axios.get(`http://localhost:5295/api/Students/details/${email}`);
                setStudentDetails(studentResponse.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCourses = async () => {
            try {
                const courseResponse = await axios.get('http://localhost:5295/api/Courses/approved');
                setCourses(courseResponse.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchStudentDetails();
        fetchCourses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleBuyCourse = async (courseId) => {
        const enrollment = { StudentId: studentDetails.userId, CourseId: courseId };
        try {
            await axios.post('http://localhost:5295/api/Enrollments', enrollment);
            setMyCourses((prev) => [...prev, { courseId }]);
            setPurchaseStatus(`You have successfully purchased the course with ID: ${courseId}`);
        } catch (err) {
            console.error("Error enrolling in the course:", err);
        }
    };

    const handleModuleNavigation = async (courseId) => {
        setCurrentCourseId(courseId);
        setCurrentModuleIndex(0);
        // Fetch modules for the selected course
        try {
            const modulesResponse = await axios.get(`http://localhost:5295/api/Modules/course/${courseId}`);
            setCurrentCourseModules(modulesResponse.data);
        } catch (err) {
            console.error("Error fetching modules:", err);
        }
    };

    const handleNextModule = () => {
        setCurrentModuleIndex((prevIndex) => prevIndex + 1);
    };

    const handleFinishCourse = async (courseId) => {
        const completedCourse = myCourses.find(course => course.courseId === courseId);
        if (completedCourse) {
            setCompletedCourses((prev) => [...prev, completedCourse]);
            setMyCourses((prev) => prev.filter(course => course.courseId !== courseId));
            setCurrentCourseId(null); // Reset current course
            setCurrentModuleIndex(0); // Reset module index
            setCurrentCourseModules([]); // Clear current modules
        }
    };

    const generateCertificate = (course) => {
        const doc = new jsPDF();
        const date = new Date().toLocaleString();
        
        doc.text("Kinston E-Learning University", 20, 20);
        doc.text(`Date: ${date}`, 20, 30);
        doc.text(`Student Name: ${studentDetails.name}`, 20, 50);
        doc.text(`Course Title: ${course.title}`, 20, 70);
        doc.text(`Course Description: ${course.description}`, 20, 90);
        doc.text(`Start Date: ${new Date(course.startDate).toLocaleDateString()}`, 20, 110);
        doc.text(`End Date: ${new Date(course.endDate).toLocaleDateString()}`, 20, 130);
        doc.text("Digitally Signed", 20, 150);
        
        doc.save(`${course.title}_Certificate.pdf`);
    };

    if (loading) {
        return <p>Loading student details and courses...</p>;
    }

    return (
        <div>
            <h2>Student Dashboard</h2>

            {studentDetails ? (
                <>
                    <p>Name: {studentDetails.name}</p>
                    <p>Email: {studentDetails.email}</p>
                    <p>User ID: {studentDetails.userId}</p>
                </>
            ) : (
                <p>No student details found.</p>
            )}

            <button onClick={handleLogout}>Logout</button>

            <h3>Available Courses</h3>
            {courses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.courseId}>
                                <td>{course.title}</td>
                                <td>{course.description}</td>
                                <td>{new Date(course.startDate).toLocaleDateString()}</td>
                                <td>{new Date(course.endDate).toLocaleDateString()}</td>
                                <td>{course.price}</td>
                                <td>
                                    <button onClick={() => handleBuyCourse(course.courseId)}>
                                        Buy
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No approved courses available at the moment.</p>
            )}

            {purchaseStatus && <p>{purchaseStatus}</p>}

            <h3>My Courses</h3>
            {myCourses.length > 0 ? (
                <ul>
                    {myCourses.map((course) => (
                        <li key={course.courseId}>
                            <button onClick={() => handleModuleNavigation(course.courseId)}>
                                Course ID: {course.courseId}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No courses enrolled.</p>
            )}

            {currentCourseId && currentCourseModules.length > 0 && (
                <div>
                    <h3>Course Modules</h3>
                    {currentModuleIndex < currentCourseModules.length ? (
                        <>
                            <h4>Module {currentModuleIndex + 1}</h4>
                            <p>{currentCourseModules[currentModuleIndex].content}</p>
                            <button onClick={handleNextModule} disabled={currentModuleIndex >= currentCourseModules.length - 1}>
                                Next Module
                            </button>
                            {currentModuleIndex === currentCourseModules.length - 1 && (
                                <>
                                    <button onClick={() => handleFinishCourse(currentCourseId)}>
                                        Finish Course
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <p>You have completed all modules for this course.</p>
                    )}
                </div>
            )}

            <h3>Completed Courses</h3>
            {completedCourses.length > 0 ? (
                <ul>
                    {completedCourses.map((course) => (
                        <li key={course.courseId}>
                            Course ID: {course.courseId}
                            <button onClick={() => generateCertificate(course)}>Download Certificate</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No completed courses.</p>
            )}
        </div>
    );
};

export default StudentDashboard;




/* ====== not able to view ocurse contet 

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const [studentDetails, setStudentDetails] = useState(null); // Store student details
    const [courses, setCourses] = useState([]); // Store available courses
    const [enrollments, setEnrollments] = useState([]); // Store enrolled courses
    const [purchaseStatus, setPurchaseStatus] = useState(null); // Purchase status message
    const [loading, setLoading] = useState(true); // Loading state for both student and courses
    const [selectedCourseContent, setSelectedCourseContent] = useState(null); // Content of the selected course
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0); // Track current module
    const [isCourseFinished, setIsCourseFinished] = useState(false); // Track if the course is finished
    const navigate = useNavigate();

    // Fetch student details and enrollments
    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email'); // Assuming email is stored in localStorage
                const studentResponse = await axios.get(`http://localhost:5295/api/Students/details/${email}`);
                setStudentDetails(studentResponse.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            }
        };

        // Fetch approved courses
        const fetchCourses = async () => {
            try {
                const courseResponse = await axios.get('http://localhost:5295/api/Courses/approved');
                setCourses(courseResponse.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        // Fetch enrolled courses for the student
        const fetchEnrollments = async () => {
            try {
                if (studentDetails) {
                    const enrollmentsResponse = await axios.get(`http://localhost:5295/api/Enrollments/my?studentId=${studentDetails.userId}`);
                    setEnrollments(enrollmentsResponse.data);
                }
            } catch (err) {
                console.error("Error fetching enrollments:", err);
            }
        };

        // Fetch both student details, courses, and enrollments
        fetchStudentDetails();
        fetchCourses();
        fetchEnrollments();
        setLoading(false);
    }, [studentDetails]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/');
    };

    // Check if the student is already enrolled in the course
    const isEnrolled = (courseId) => {
        return enrollments.some(enrollment => enrollment.courseId === courseId);
    };

    // Handle course enrollment
    const handleEnrollInCourse = async (courseId) => {
        try {
            const enrollmentData = {
                studentId: studentDetails.userId,
                courseId: courseId
            };

            // API call to enroll the student in the course
            await axios.post('http://localhost:5295/api/Enrollments', enrollmentData);

            setPurchaseStatus(`You have successfully enrolled in the course with ID: ${courseId}`);

            // Update enrolled courses after enrolling
            const updatedEnrollments = [...enrollments, { courseId }];
            setEnrollments(updatedEnrollments);

        } catch (error) {
            console.error("Error enrolling in course:", error);
            setPurchaseStatus(`Failed to enroll in the course with ID: ${courseId}`);
        }
    };

    // Fetch and display content for a selected course
    const handleViewCourseContent = async (courseId) => {
        try {
            const contentResponse = await axios.get(`http://localhost:5295/api/Courses/content/${courseId}`);
            setSelectedCourseContent(contentResponse.data.modules);
            setCurrentModuleIndex(0); // Start with the first module
            setIsCourseFinished(false); // Reset the course finished state
        } catch (err) {
            console.error("Error fetching course content:", err);
        }
    };

    // Move to the next module
    const handleNextModule = () => {
        if (currentModuleIndex < selectedCourseContent.length - 1) {
            setCurrentModuleIndex(currentModuleIndex + 1);
        } else {
            setIsCourseFinished(true); // Course is completed
        }
    };

    // Finish course
    const handleFinishCourse = () => {
        setSelectedCourseContent(null); // Clear the course content
        setPurchaseStatus('You have completed the course!');
        // Here you could also send data to the backend to mark the course as completed
    };

    if (loading) {
        return <p>Loading student details and courses...</p>;
    }

    return (
        <div>
            <h2>Student Dashboard</h2>
    
            {}
            {studentDetails ? (
                <>
                    <p>Name: {studentDetails.name}</p>
                    <p>Email: {studentDetails.email}</p>
                    <p>User ID: {studentDetails.userId}</p>
                </>
            ) : (
                <p>No student details found.</p>
            )}
    
            <button onClick={handleLogout}>Logout</button>
    
            {}
            <h3>Available Courses</h3>
            {courses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.courseId}>
                                <td>{course.title}</td>
                                <td>{course.description}</td>
                                <td>{new Date(course.startDate).toLocaleDateString()}</td>
                                <td>{new Date(course.endDate).toLocaleDateString()}</td>
                                <td>{course.price}</td>
                                <td>
                                    {isEnrolled(course.courseId) ? (
                                        <button disabled>Enrolled</button>
                                    ) : (
                                        <button onClick={() => handleEnrollInCourse(course.courseId)}>Buy</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No approved courses available at the moment.</p>
            )}
    
            {}
            {purchaseStatus && <p>{purchaseStatus}</p>}
    
            {}
            <h3>My Courses</h3>
            {enrollments.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments.map((enrollment) => {
                            const enrolledCourse = courses.find(course => course.courseId === enrollment.courseId);
                            return (
                                <tr key={enrollment.courseId}>
                                    <td>{enrolledCourse?.title}</td>
                                    <td>{enrolledCourse?.description}</td>
                                    <td>
                                        <button onClick={() => handleViewCourseContent(enrollment.courseId)}>
                                            View Content
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No enrolled courses yet.</p>
            )}
    
            {}
            {selectedCourseContent && (
                <div>
                    <h4>Course Content</h4>
                    <p>Module {currentModuleIndex + 1}: {selectedCourseContent[currentModuleIndex].moduleName}</p>
                    <p>{selectedCourseContent[currentModuleIndex].content}</p>
    
                    {isCourseFinished ? (
                        <button onClick={handleFinishCourse}>Finish Course</button>
                    ) : (
                        <button onClick={handleNextModule}>Next Module</button>
                    )}
                </div>
            )}
        </div>
    );
    
};

export default StudentDashboard;*/



/* ========== my course diplayed =============

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const [studentDetails, setStudentDetails] = useState(null); // Store student details
    const [courses, setCourses] = useState([]); // Store all courses
    const [myCourses, setMyCourses] = useState([]); // Store enrolled courses
    const [purchaseStatus, setPurchaseStatus] = useState(null); // Purchase status message
    const [loading, setLoading] = useState(true); // Loading state for both student and courses
    const navigate = useNavigate();

    // Fetch student details and courses
    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email'); // Assuming email is stored in localStorage
                const studentResponse = await axios.get(`http://localhost:5295/api/Students/details/${email}`);
                setStudentDetails(studentResponse.data);

                // Fetch my enrolled courses
                const enrolledCoursesResponse = await axios.get(`http://localhost:5295/api/Enrollments/my?studentId=${studentResponse.data.userId}`);
                setMyCourses(enrolledCoursesResponse.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        // Fetch approved courses
        const fetchCourses = async () => {
            try {
                const courseResponse = await axios.get('http://localhost:5295/api/Courses/approved');
                setCourses(courseResponse.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        // Fetch both student details and courses
        fetchStudentDetails();
        fetchCourses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleBuyCourse = async (courseId) => {
        try {
            const studentId = studentDetails.userId; // Get student ID
            const enrollment = { StudentId: studentId, CourseId: courseId }; // Prepare enrollment data

            // Enroll the student in the course
            await axios.post('http://localhost:5295/api/Enrollments', enrollment);
            setMyCourses([...myCourses, { courseId, title: courses.find(course => course.courseId === courseId).title }]); // Add course to myCourses state
            setPurchaseStatus(`You have successfully enrolled in the course: ${courses.find(course => course.courseId === courseId).title}`);
        } catch (err) {
            console.error("Error enrolling in course:", err);
            setPurchaseStatus("Failed to enroll in the course.");
        }
    };

    if (loading) {
        return <p>Loading student details and courses...</p>;
    }

    return (
        <div>
            <h2>Student Dashboard</h2>

            {studentDetails ? (
                <>
                    <p>Name: {studentDetails.name}</p>
                    <p>Email: {studentDetails.email}</p>
                    <p>User ID: {studentDetails.userId}</p>
                </>
            ) : (
                <p>No student details found.</p>
            )}

            <button onClick={handleLogout}>Logout</button>

            <h3>Available Courses</h3>
            {courses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.courseId}>
                                <td>{course.title}</td>
                                <td>{course.description}</td>
                                <td>{new Date(course.startDate).toLocaleDateString()}</td>
                                <td>{new Date(course.endDate).toLocaleDateString()}</td>
                                <td>{course.price}</td>
                                <td>
                                    <button onClick={() => handleBuyCourse(course.courseId)}>
                                        Buy
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No approved courses available at the moment.</p>
            )}

            {purchaseStatus && <p>{purchaseStatus}</p>}

            <h3>My Courses</h3>
            {myCourses.length > 0 ? (
                <ul>
                    {myCourses.map((course) => (
                        <li key={course.courseId}>{course.title}</li>
                    ))}
                </ul>
            ) : (
                <p>You are not enrolled in any courses.</p>
            )}
        </div>
    );
};

export default StudentDashboard;

*/



/* =========================== perfect working =================== without style ==========

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const [studentDetails, setStudentDetails] = useState(null);
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [purchaseStatus, setPurchaseStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [modules, setModules] = useState([]);
    const [courseCompleted, setCourseCompleted] = useState(false);
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email');
                const studentResponse = await axios.get(`http://localhost:5295/api/Students/details/${email}`);
                setStudentDetails(studentResponse.data);

                const enrolledCoursesResponse = await axios.get(`http://localhost:5295/api/Enrollments/my?studentId=${studentResponse.data.userId}`);
                setMyCourses(enrolledCoursesResponse.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCourses = async () => {
            try {
                const courseResponse = await axios.get('http://localhost:5295/api/Courses/approved');
                setCourses(courseResponse.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchStudentDetails();
        fetchCourses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleBuyCourse = async (courseId) => {
        try {
            const studentId = studentDetails.userId;
            const enrollment = { StudentId: studentId, CourseId: courseId };

            await axios.post('http://localhost:5295/api/Enrollments', enrollment);
            const course = courses.find(course => course.courseId === courseId);
            setMyCourses([...myCourses, { ...course }]);
            setPurchaseStatus(`You have successfully enrolled in the course: ${course.title}`);
        } catch (err) {
            console.error("Error enrolling in course:", err);
            setPurchaseStatus("Failed to enroll in the course.");
        }
    };

    const handleSelectCourse = async (course) => {
        try {
            const modulesResponse = await axios.get(`http://localhost:5295/api/Courses/${course.courseId}/modules`);
            setModules(modulesResponse.data);
            setSelectedCourse(course);
            setCurrentModuleIndex(0);
        } catch (err) {
            console.error("Error fetching course modules:", err);
        }
    };

    const handleNextModule = () => {
        if (currentModuleIndex < modules.length - 1) {
            setCurrentModuleIndex(currentModuleIndex + 1);
        } else {
            setCourseCompleted(true);
        }
    };

const handleSubmitRating = async () => {
    try {
        const enrollmentId = myCourses.find(course => course.courseId === selectedCourse.courseId).enrollmentId; // Get the enrollmentId
        const validatedRating = (rating >= 1 && rating <= 5) ? rating : 0; // Ensure rating is valid
        await axios.put(`http://localhost:5295/api/Enrollments/${enrollmentId}/rating`, validatedRating);
        alert(`Thank you for rating the course: ${validatedRating}/5`);
        setCourseCompleted(false); // Reset the course completion state
        setSelectedCourse(null); // Reset the selected course
    } catch (err) {
        console.error("Error submitting rating:", err);
    }
};


//////////////////////// remove the above code


    if (loading) {
        return <p>Loading student details and courses...</p>;
    }

    return (
        <div>
            <h2>Student Dashboard</h2>

            {studentDetails ? (
                <>
                    <p>Name: {studentDetails.name}</p>
                    <p>Email: {studentDetails.email}</p>
                    <p>User ID: {studentDetails.userId}</p>
                </>
            ) : (
                <p>No student details found.</p>
            )}

            <button onClick={handleLogout}>Logout</button>

            <h3>Available Courses</h3>
            {courses.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.courseId}>
                                <td>{course.title}</td>
                                <td>{course.description}</td>
                                <td>{new Date(course.startDate).toLocaleDateString()}</td>
                                <td>{new Date(course.endDate).toLocaleDateString()}</td>
                                <td>{course.price}</td>
                                <td>
                                    <button onClick={() => handleBuyCourse(course.courseId)}>
                                        Buy
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No approved courses available at the moment.</p>
            )}

            {purchaseStatus && <p>{purchaseStatus}</p>}

            <h3>My Courses</h3>
            {myCourses.length > 0 ? (
                <ul>
                    {myCourses.map((course) => (
                        <li key={course.courseId} onClick={() => handleSelectCourse(course)}>
                            {course.title}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You are not enrolled in any courses.</p>
            )}

            {selectedCourse && (
                <div>
                    <h3>{selectedCourse.title}</h3>
                    <p>Description: {selectedCourse.description}</p>
                    <p>Start Date: {new Date(selectedCourse.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(selectedCourse.endDate).toLocaleDateString()}</p>

                    {modules.length > 0 && (
                        <div>
                            <h4>Current Module: {modules[currentModuleIndex]?.title}</h4>
                            <p>{modules[currentModuleIndex]?.content}</p>
                            <button onClick={handleNextModule}>
                                {currentModuleIndex < modules.length - 1 ? 'Next Module' : 'Finish Course'}
                            </button>
                        </div>
                    )}

                    {courseCompleted && (
                        <div>
                            <h4>Course Completed!</h4>
                            <label>
                                Rate this course:
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                />
                            </label>
                            <button onClick={handleSubmitRating}>Submit Rating</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
*/


/* ============ styles 1 ============

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const [studentDetails, setStudentDetails] = useState(null);
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [purchaseStatus, setPurchaseStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [modules, setModules] = useState([]);
    const [courseCompleted, setCourseCompleted] = useState(false);
    const [rating, setRating] = useState(0);
    const [activeTab, setActiveTab] = useState('availableCourses');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email');
                const studentResponse = await axios.get(`http://localhost:5295/api/Students/details/${email}`);
                setStudentDetails(studentResponse.data);

                const enrolledCoursesResponse = await axios.get(`http://localhost:5295/api/Enrollments/my?studentId=${studentResponse.data.userId}`);
                setMyCourses(enrolledCoursesResponse.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCourses = async () => {
            try {
                const courseResponse = await axios.get('http://localhost:5295/api/Courses/approved');
                setCourses(courseResponse.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchStudentDetails();
        fetchCourses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleBuyCourse = async (courseId) => {
        try {
            const studentId = studentDetails.userId;
            const enrollment = { StudentId: studentId, CourseId: courseId };

            await axios.post('http://localhost:5295/api/Enrollments', enrollment);
            const course = courses.find(course => course.courseId === courseId);
            setMyCourses([...myCourses, { ...course }]);
            setPurchaseStatus(`You have successfully enrolled in the course: ${course.title}`);
        } catch (err) {
            console.error("Error enrolling in course:", err);
            setPurchaseStatus("Failed to enroll in the course.");
        }
    };

    const handleSelectCourse = async (course) => {
        try {
            const modulesResponse = await axios.get(`http://localhost:5295/api/Courses/${course.courseId}/modules`);
            setModules(modulesResponse.data);
            setSelectedCourse(course);
            setCurrentModuleIndex(0);
        } catch (err) {
            console.error("Error fetching course modules:", err);
        }
    };

    const handleNextModule = () => {
        if (currentModuleIndex < modules.length - 1) {
            setCurrentModuleIndex(currentModuleIndex + 1);
        } else {
            setCourseCompleted(true);
        }
    };

    const handleSubmitRating = async () => {
        try {
            const enrollmentId = myCourses.find(course => course.courseId === selectedCourse.courseId).enrollmentId; // Get the enrollmentId
            const validatedRating = (rating >= 1 && rating <= 5) ? rating : 0; // Ensure rating is valid
            await axios.put(`http://localhost:5295/api/Enrollments/${enrollmentId}/rating`, validatedRating);
            alert(`Thank you for rating the course: ${validatedRating}/5`);
            setCourseCompleted(false); // Reset the course completion state
            setSelectedCourse(null); // Reset the selected course
        } catch (err) {
            console.error("Error submitting rating:", err);
        }
    };

    if (loading) {
        return <p>Loading student details and courses...</p>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Student Dashboard</h2>

            {studentDetails ? (
                <div style={styles.studentDetails}>
                    <p>Name: {studentDetails.name}</p>
                    <p>Email: {studentDetails.email}</p>
                    <p>User ID: {studentDetails.userId}</p>
                </div>
            ) : (
                <p>No student details found.</p>
            )}

            <div style={styles.buttonContainer}>
                <button onClick={() => setActiveTab('availableCourses')} style={styles.tabButton}>Available Courses</button>
                <button onClick={() => setActiveTab('myCourses')} style={styles.tabButton}>My Courses</button>
                <button onClick={() => setActiveTab('completedCourses')} style={styles.tabButton}>Completed Courses</button>
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>

            {activeTab === 'availableCourses' && (
                <div style={styles.tabContent}>
                    <h3>Available Courses</h3>
                    {courses.length > 0 ? (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Description</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.courseId}>
                                        <td>{course.title}</td>
                                        <td>{course.description}</td>
                                        <td>{new Date(course.startDate).toLocaleDateString()}</td>
                                        <td>{new Date(course.endDate).toLocaleDateString()}</td>
                                        <td>{course.price}</td>
                                        <td>
                                            <button onClick={() => handleBuyCourse(course.courseId)} style={styles.actionButton}>
                                                Buy
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No approved courses available at the moment.</p>
                    )}
                    {purchaseStatus && <p>{purchaseStatus}</p>}
                </div>
            )}

            {activeTab === 'myCourses' && (
                <div style={styles.tabContent}>
                    <h3>My Courses</h3>
                    {myCourses.length > 0 ? (
                        <ul style={styles.courseList}>
                            {myCourses.map((course) => (
                                <li key={course.courseId} onClick={() => handleSelectCourse(course)} style={styles.courseItem}>
                                    {course.title}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You are not enrolled in any courses.</p>
                    )}
                </div>
            )}

            {activeTab === 'completedCourses' && (
                <div style={styles.tabContent}>
                    <h3>Completed Courses</h3>
                    {completedCourses.length > 0 ? (
                        <ul style={styles.courseList}>
                            {completedCourses.map((course) => (
                                <li key={course.courseId} style={styles.courseItem}>
                                    {course.title}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You have not completed any courses.</p>
                    )}
                </div>
            )}

            {selectedCourse && (
                <div style={styles.selectedCourse}>
                    <h3>{selectedCourse.title}</h3>
                    <p>Description: {selectedCourse.description}</p>
                    <p>Start Date: {new Date(selectedCourse.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(selectedCourse.endDate).toLocaleDateString()}</p>

                    {modules.length > 0 && (
                        <div>
                            <h4>Current Module: {modules[currentModuleIndex]?.title}</h4>
                            <p>{modules[currentModuleIndex]?.content}</p>
                            <button onClick={handleNextModule} style={styles.actionButton}>
                                {currentModuleIndex < modules.length - 1 ? 'Next Module' : 'Finish Course'}
                            </button>
                        </div>
                    )}

                    {courseCompleted && (
                        <div>
                            <h4>Course Completed!</h4>
                            <label>
                                Rate this course:
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    style={styles.ratingInput}
                                />
                            </label>
                            <button onClick={handleSubmitRating} style={styles.actionButton}>Submit Rating</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: '0 auto'
    },
    heading: {
        textAlign: 'center',
        color: '#333',
    },
    studentDetails: {
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    tabButton: {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#007BFF',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#DC3545',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    tabContent: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    actionButton: {
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#28A745',
        color: '#fff',
        cursor: 'pointer',
    },
    courseList: {
        listStyleType: 'none',
        padding: 0,
    },
    courseItem: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        marginBottom: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    courseItemHover: {
        backgroundColor: '#f0f0f0',
    },
    selectedCourse: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    ratingInput: {
        marginLeft: '10px',
        padding: '5px',
        width: '50px',
    },
};

export default StudentDashboard;
*/

/* ===================================== style 2 =========================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const [studentDetails, setStudentDetails] = useState(null);
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [purchaseStatus, setPurchaseStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [modules, setModules] = useState([]);
    const [courseCompleted, setCourseCompleted] = useState(false);
    const [rating, setRating] = useState(0);
    const [activeTab, setActiveTab] = useState('availableCourses');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email');
                const studentResponse = await axios.get(`http://localhost:5295/api/Students/details/${email}`);
                setStudentDetails(studentResponse.data);

                const enrolledCoursesResponse = await axios.get(`http://localhost:5295/api/Enrollments/my?studentId=${studentResponse.data.userId}`);
                setMyCourses(enrolledCoursesResponse.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCourses = async () => {
            try {
                const courseResponse = await axios.get('http://localhost:5295/api/Courses/approved');
                setCourses(courseResponse.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchStudentDetails();
        fetchCourses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleBuyCourse = async (courseId) => {
        try {
            const studentId = studentDetails.userId;
            const enrollment = { StudentId: studentId, CourseId: courseId };

            await axios.post('http://localhost:5295/api/Enrollments', enrollment);
            const course = courses.find(course => course.courseId === courseId);
            setMyCourses([...myCourses, { ...course }]);
            setPurchaseStatus(`You have successfully enrolled in the course: ${course.title}`);
        } catch (err) {
            console.error("Error enrolling in course:", err);
            setPurchaseStatus("Failed to enroll in the course.");
        }
    };

    const handleSelectCourse = async (course) => {
        try {
            const modulesResponse = await axios.get(`http://localhost:5295/api/Courses/${course.courseId}/modules`);
            setModules(modulesResponse.data);
            setSelectedCourse(course);
            setCurrentModuleIndex(0);
        } catch (err) {
            console.error("Error fetching course modules:", err);
        }
    };

    const handleNextModule = () => {
        if (currentModuleIndex < modules.length - 1) {
            setCurrentModuleIndex(currentModuleIndex + 1);
        } else {
            setCourseCompleted(true);
        }
    };

    const handleSubmitRating = async () => {
        try {
            const enrollmentId = myCourses.find(course => course.courseId === selectedCourse.courseId).enrollmentId; // Get the enrollmentId
            const validatedRating = (rating >= 1 && rating <= 5) ? rating : 0; // Ensure rating is valid
            await axios.put(`http://localhost:5295/api/Enrollments/${enrollmentId}/rating`, validatedRating);
            alert(`Thank you for rating the course: ${validatedRating}/5`);
            setCourseCompleted(false); // Reset the course completion state
            setSelectedCourse(null); // Reset the selected course
        } catch (err) {
            console.error("Error submitting rating:", err);
        }
    };

    if (loading) {
        return <p>Loading student details and courses...</p>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Student Dashboard</h2>

            {studentDetails ? (
                <div style={styles.studentDetails}>
                    <p>Name: {studentDetails.name}</p>
                    <p>Email: {studentDetails.email}</p>
                    <p>User ID: {studentDetails.userId}</p>
                </div>
            ) : (
                <p>No student details found.</p>
            )}

            <div style={styles.buttonContainer}>
                <button onClick={() => setActiveTab('availableCourses')} style={styles.tabButton}>Available Courses</button>
                <button onClick={() => setActiveTab('myCourses')} style={styles.tabButton}>My Courses</button>
                <button onClick={() => setActiveTab('completedCourses')} style={styles.tabButton}>Completed Courses</button>
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>

            {activeTab === 'availableCourses' && (
                <div style={styles.tabContent}>
                    <h3>Available Courses</h3>
                    <div style={styles.cardContainer}>
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <div key={course.courseId} style={styles.courseCard}>
                                    <h4>{course.title}</h4>
                                    <p>{course.description}</p>
                                    <p>Start Date: {new Date(course.startDate).toLocaleDateString()}</p>
                                    <p>End Date: {new Date(course.endDate).toLocaleDateString()}</p>
                                    <p>Price: {course.price}</p>
                                    <button onClick={() => handleBuyCourse(course.courseId)} style={styles.actionButton}>
                                        Buy
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No approved courses available at the moment.</p>
                        )}
                    </div>
                    {purchaseStatus && <p>{purchaseStatus}</p>}
                </div>
            )}

            {activeTab === 'myCourses' && (
                <div style={styles.tabContent}>
                    <h3>My Courses</h3>
                    <div style={styles.cardContainer}>
                        {myCourses.length > 0 ? (
                            myCourses.map((course) => (
                                <div key={course.courseId} style={styles.courseCard}>
                                    <h4>{course.title}</h4>
                                    <p>{course.description}</p>
                                    <button onClick={() => handleSelectCourse(course)} style={styles.actionButton}>
                                        View Modules
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>You are not enrolled in any courses.</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'completedCourses' && (
                <div style={styles.tabContent}>
                    <h3>Completed Courses</h3>
                    <div style={styles.cardContainer}>
                        {completedCourses.length > 0 ? (
                            completedCourses.map((course) => (
                                <div key={course.courseId} style={styles.courseCard}>
                                    <h4>{course.title}</h4>
                                    <p>{course.description}</p>
                                </div>
                            ))
                        ) : (
                            <p>You have not completed any courses.</p>
                        )}
                    </div>
                </div>
            )}

            {selectedCourse && (
                <div style={styles.selectedCourse}>
                    <h3>{selectedCourse.title}</h3>
                    <p>Description: {selectedCourse.description}</p>
                    <p>Start Date: {new Date(selectedCourse.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(selectedCourse.endDate).toLocaleDateString()}</p>

                    {modules.length > 0 && (
                        <div>
                            <h4>Current Module: {modules[currentModuleIndex]?.title}</h4>
                            <p>{modules[currentModuleIndex]?.content}</p>
                            <button onClick={handleNextModule} style={styles.actionButton}>
                                {currentModuleIndex < modules.length - 1 ? 'Next Module' : 'Finish Course'}
                            </button>
                        </div>
                    )}

                    {courseCompleted && (
                        <div>
                            <h4>Course Completed!</h4>
                            <label>
                                Rate this course:
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    style={styles.ratingInput}
                                />
                            </label>
                            <button onClick={handleSubmitRating} style={styles.actionButton}>Submit Rating</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
    },
    studentDetails: {
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: '20px',
    },
    tabButton: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#007BFF',
        color: '#fff',
    },
    logoutButton: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#DC3545',
        color: '#fff',
    },
    tabContent: {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginTop: '20px',
    },
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    courseCard: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '15px',
        margin: '10px',
        flex: '0 1 calc(30% - 20px)', // Responsive card width
        transition: 'transform 0.2s',
        cursor: 'pointer',
    },
    courseCardHover: {
        transform: 'scale(1.05)',
    },
    actionButton: {
        padding: '10px 15px',
        backgroundColor: '#28A745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    selectedCourse: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '15px',
        marginTop: '20px',
    },
    ratingInput: {
        marginLeft: '10px',
        width: '50px',
    },
};

export default StudentDashboard;
*/

/*============================= style 3 =================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const [studentDetails, setStudentDetails] = useState(null);
    const [courses, setCourses] = useState([]); // Available courses
    const [myCourses, setMyCourses] = useState([]); // Enrolled courses
    const [completedCourses, setCompletedCourses] = useState([]); // Completed courses
    const [purchaseStatus, setPurchaseStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null); // Course currently being studied
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [modules, setModules] = useState([]); // Modules of the selected course
    const [courseCompleted, setCourseCompleted] = useState(false);
    const [rating, setRating] = useState(0);
    const [activeTab, setActiveTab] = useState('availableCourses'); // Active tab (Available, My Courses, Completed)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const email = localStorage.getItem('email');
                const studentResponse = await axios.get(`http://localhost:5295/api/Students/details/${email}`);
                setStudentDetails(studentResponse.data);

                const enrolledCoursesResponse = await axios.get(`http://localhost:5295/api/Enrollments/my?studentId=${studentResponse.data.userId}`);
                setMyCourses(enrolledCoursesResponse.data);
            } catch (err) {
                console.error("Error fetching student details:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCourses = async () => {
            try {
                const courseResponse = await axios.get('http://localhost:5295/api/Courses/approved');
                setCourses(courseResponse.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchStudentDetails();
        fetchCourses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleBuyCourse = async (courseId) => {
        try {
            const studentId = studentDetails.userId;
            const enrollment = { StudentId: studentId, CourseId: courseId };

            await axios.post('http://localhost:5295/api/Enrollments', enrollment);
            const course = courses.find(course => course.courseId === courseId);
            setMyCourses([...myCourses, { ...course }]);
            setPurchaseStatus(`You have successfully enrolled in the course: ${course.title}`);
        } catch (err) {
            console.error("Error enrolling in course:", err);
            setPurchaseStatus("Failed to enroll in the course.");
        }
    };

    const handleSelectCourse = async (course) => {
        try {
            const modulesResponse = await axios.get(`http://localhost:5295/api/Courses/${course.courseId}/modules`);
            setModules(modulesResponse.data);
            setSelectedCourse(course);
            setCurrentModuleIndex(0);
        } catch (err) {
            console.error("Error fetching course modules:", err);
        }
    };

    const handleNextModule = () => {
        if (currentModuleIndex < modules.length - 1) {
            setCurrentModuleIndex(currentModuleIndex + 1);
        } else {
            setCourseCompleted(true);
        }
    };

    const handleSubmitRating = async () => {
        try {
            const enrollmentId = myCourses.find(course => course.courseId === selectedCourse.courseId).enrollmentId; // Get the enrollmentId
            const validatedRating = (rating >= 1 && rating <= 5) ? rating : 0; // Ensure rating is valid
            await axios.put(`http://localhost:5295/api/Enrollments/${enrollmentId}/rating`, validatedRating);
            alert(`Thank you for rating the course: ${validatedRating}/5`);
            
            setCompletedCourses([...completedCourses, selectedCourse]); // Move course to completed section
            setCourseCompleted(false); // Reset the course completion state
            setSelectedCourse(null); // Reset the selected course
        } catch (err) {
            console.error("Error submitting rating:", err);
        }
    };

    if (loading) {
        return <p>Loading student details and courses...</p>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Student Dashboard</h2>

            {studentDetails ? (
                <div style={styles.studentDetails}>
                    <p>Name: {studentDetails.name}</p>
                    <p>Email: {studentDetails.email}</p>
                    <p>User ID: {studentDetails.userId}</p>
                </div>
            ) : (
                <p>No student details found.</p>
            )}

            <div style={styles.buttonContainer}>
                <button onClick={() => setActiveTab('availableCourses')} style={styles.tabButton}>Available Courses</button>
                <button onClick={() => setActiveTab('myCourses')} style={styles.tabButton}>My Courses</button>
                <button onClick={() => setActiveTab('completedCourses')} style={styles.tabButton}>Completed Courses</button>
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>

            {activeTab === 'availableCourses' && (
                <div style={styles.tabContent}>
                    <h3>Available Courses</h3>
                    <div style={styles.cardContainer}>
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <div
                                    key={course.courseId}
                                    style={styles.courseCard}
                                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    <h4>{course.title}</h4>
                                    <p>{course.description}</p>
                                    <p>Start Date: {new Date(course.startDate).toLocaleDateString()}</p>
                                    <p>End Date: {new Date(course.endDate).toLocaleDateString()}</p>
                                    <p>Price: {course.price}</p>
                                    <button onClick={() => handleBuyCourse(course.courseId)} style={styles.actionButton}>
                                        Buy
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No approved courses available at the moment.</p>
                        )}
                    </div>
                    {purchaseStatus && <p>{purchaseStatus}</p>}
                </div>
            )}

            {activeTab === 'myCourses' && (
                <div style={styles.tabContent}>
                    <h3>My Courses</h3>
                    <div style={styles.cardContainer}>
                        {myCourses.length > 0 ? (
                            myCourses.map((course) => (
                                <div key={course.courseId} style={styles.courseCard}>
                                    <h4>{course.title}</h4>
                                    <p>{course.description}</p>
                                    <button onClick={() => handleSelectCourse(course)} style={styles.actionButton}>
                                        View Modules
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>You are not enrolled in any courses.</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'completedCourses' && (
                <div style={styles.tabContent}>
                    <h3>Completed Courses</h3>
                    <div style={styles.cardContainer}>
                        {completedCourses.length > 0 ? (
                            completedCourses.map((course) => (
                                <div key={course.courseId} style={styles.courseCard}>
                                    <h4>{course.title}</h4>
                                    <p>{course.description}</p>
                                </div>
                            ))
                        ) : (
                            <p>You have not completed any courses.</p>
                        )}
                    </div>
                </div>
            )}

            {selectedCourse && (
                <div style={styles.selectedCourse}>
                    <h3>{selectedCourse.title}</h3>
                    <p>Description: {selectedCourse.description}</p>
                    <p>Start Date: {new Date(selectedCourse.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(selectedCourse.endDate).toLocaleDateString()}</p>

                    {modules.length > 0 && (
                        <div>
                            <h4>Current Module: {modules[currentModuleIndex]?.title}</h4>
                            <p>{modules[currentModuleIndex]?.content}</p>
                            <button onClick={handleNextModule} style={styles.actionButton}>
                                {currentModuleIndex < modules.length - 1 ? 'Next Module' : 'Finish Course'}
                            </button>
                        </div>
                    )}

                    {courseCompleted && (
                        <div>
                            <h4>Course Completed!</h4>
                            <p>Thank you for completing the course. Please provide a rating:</p>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                style={styles.ratingInput}
                            />
                            <button onClick={handleSubmitRating} style={styles.actionButton}>
                                Submit Rating
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
    },
    heading: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    studentDetails: {
        marginBottom: '20px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    tabButton: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    logoutButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: 'red',
        color: 'white',
        cursor: 'pointer',
    },
    tabContent: {
        marginBottom: '20px',
    },
    cardContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
    },
    courseCard: {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease-in-out',
    },
    actionButton: {
        marginTop: '10px',
        padding: '10px 15px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    selectedCourse: {
        marginTop: '20px',
    },
    ratingInput: {
        width: '50px',
        marginRight: '10px',
    },
};

export default StudentDashboard;
*/
