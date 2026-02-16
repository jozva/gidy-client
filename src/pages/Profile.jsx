import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiZap } from "react-icons/fi";

function Profile() {
  const [user, setUser] = useState(null);
  const [showEducation, setShowEducation] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState(null);
  const [editingEduIndex, setEditingEduIndex] = useState(null);
  const [editingCertIndex, setEditingCertIndex] = useState(null);




  const nav = useNavigate();
  const token = localStorage.getItem("token");

  // Education form state
  const [eduForm, setEduForm] = useState({
    college: "",
    degree: "",
    field: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
  });

  // Experience form state
  const [expForm, setExpForm] = useState({
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
  });

  const [showCertification, setShowCertification] = useState(false);

  const [certForm, setCertForm] = useState({
    name: "",
    provider: "",
    url: "",
    id: "",
    issueDate: "",
    expiryDate: "",
    description: "",
  });

  const skillOptions = [
    "JavaScript",
    "TypeScript",
    "React",
    "Angular",
    "Vue.js",
    "Svelte",
    "Node.js",
    "Express.js",
    "Django",
    "Flask",
    "Spring Boot",
    "Java",
    "Python",
    "C#",
    "C++",
    "HTML",
    "CSS",
    "Tailwind",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
  ];



  const [showSkills, setShowSkills] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [showBio, setShowBio] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    location: "",
    bio: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const fileInputRef = useRef();


  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "https://gidy-server.onrender.com/api/profile",
        { headers: { Authorization: token } }
      );
      setUser(res.data);
      setProfileForm({
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        location: res.data.location || "",
        bio: res.data.bio || "",
      });



    } catch (err) {
      console.log(err.response?.data);
      nav("/");
    }
  };

  useEffect(() => {
    if (!token) {
      nav("/");
      return;
    }
    fetchProfile();
  }, []);

  if (!user) return <p className="p-6">Loading...</p>;

  // Profile completion
  const completion = () => {
    let score = 0;
    if (user.bio) score += 20;
    if (user.skills?.length) score += 20;
    if (user.education?.length) score += 20;
    if (user.experience?.length) score += 20;
    if (user.certifications?.length) score += 20;
    return score;
  };

  const percent = completion();

  // Add education
  const handleAddEducation = async () => {
    try {
      const updatedEducation = [
        ...(user.education || []),
        eduForm,
      ];

      const res = await axios.put(
        "https://gidy-server.onrender.com/api/profile",
        { education: updatedEducation },
        { headers: { Authorization: token } }
      );

      setUser(res.data);
      setShowEducation(false);

      setEduForm({
        college: "",
        degree: "",
        field: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Add experience
  const handleAddExperience = async () => {
    try {
      const updatedExperience = [
        ...(user.experience || []),
        expForm,
      ];

      const res = await axios.put(
        "https://gidy-server.onrender.com/api/profile",
        { experience: updatedExperience },
        { headers: { Authorization: token } }
      );

      setUser(res.data);
      setShowExperience(false);

      setExpForm({
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
      });
    } catch (err) {
      console.log(err);
    }
  };




  const handleAddSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleSaveSkills = async () => {
    try {
      const res = await axios.put(
        "https://gidy-server.onrender.com/api/profile",
        { skills: selectedSkills },
        { headers: { Authorization: token } }
      );

      setUser(res.data);
      setShowSkills(false);
    } catch (err) {
      console.log(err);
    }
  };


  const generateBio = async () => {
    try {
      const res = await axios.post(
        "https://gidy-server.onrender.com/api/profile/generate-bio",
        {},
        { headers: { Authorization: token } }
      );
      setProfileForm((prev) => ({
        ...prev,
        bio: res.data.bio,
      }));
    } catch (err) {
      console.log(err);
    }
  };


  const handleUpdateProfile = async () => {
    try {
      // update profile text fields
      const res = await axios.put(
        "https://gidy-server.onrender.com/api/profile",
        profileForm,
        { headers: { Authorization: token } }
      );

      // upload resume if exists
      if (resumeFile) {
        const formData = new FormData();
        formData.append("firstName", profileForm.firstName);
        formData.append("resume", resumeFile);


        await axios.post(
          "https://gidy-server.onrender.com/api/profile/upload-resume",
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setUser(res.data);
      setShowBio(false);
      setResumeFile(null);
      setProfileForm(user);

    } catch (err) {
      console.log(err);
    }
  };



  const handleDeleteExperience = async (index) => {
    const updated = user.experience.filter((_, i) => i !== index);

    const res = await axios.put(
      "https://gidy-server.onrender.com/api/profile",
      { experience: updated },
      { headers: { Authorization: token } }
    );

    setUser(res.data);
  };




  const handleSaveExperience = async () => {
    try {
      let updatedExperience = [...(user.experience || [])];

      if (editingExpIndex !== null) {
        // edit mode
        updatedExperience[editingExpIndex] = expForm;
      } else {
        // add mode
        updatedExperience.push(expForm);
      }

      const res = await axios.put(
        "https://gidy-server.onrender.com/api/profile",
        { experience: updatedExperience },
        { headers: { Authorization: token } }
      );

      setUser(res.data);
      setShowExperience(false);
      resetExperienceForm();
      setEditingExpIndex(null);

      // reset form
      setExpForm({
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
      });
    } catch (err) {
      console.log(err);
    }
  };


  const handleSaveEducation = async () => {
    try {
      let updatedEducation = [...(user.education || [])];

      if (editingEduIndex !== null) {
        updatedEducation[editingEduIndex] = eduForm;
      } else {
        updatedEducation.push(eduForm);
      }

      const res = await axios.put(
        "https://gidy-server.onrender.com/api/profile",
        { education: updatedEducation },
        { headers: { Authorization: token } }
      );

      setUser(res.data);
      setShowEducation(false);
      resetEducationForm();
    } catch (err) {
      console.log(err);
    }
  };


  const handleDeleteEducation = async (index) => {
    try {
      const updatedEducation = [...user.education];
      updatedEducation.splice(index, 1);

      const res = await axios.put(
        "https://gidy-server.onrender.com/api/profile",
        { education: updatedEducation },
        { headers: { Authorization: token } }
      );

      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveCertification = async () => {
    try {
      let updatedCert = [...(user.certifications || [])];

      if (editingCertIndex !== null) {
        updatedCert[editingCertIndex] = certForm;
      } else {
        updatedCert.push(certForm);
      }

      const res = await axios.put(
        "https://gidy-server.onrender.com/api/profile",
        { certifications: updatedCert },
        { headers: { Authorization: token } }
      );

      setUser(res.data);
      setShowCertification(false);
      setEditingCertIndex(null);

      setCertForm({
        name: "",
        provider: "",
        url: "",
        id: "",
        issueDate: "",
        expiryDate: "",
        description: "",
      });
    } catch (err) {
      console.log(err);
    }
  };



  const handleDeleteCertification = async (index) => {
    try {
      const updatedCert = [...user.certifications];
      updatedCert.splice(index, 1);

      const res = await axios.put(
        "https://gidy-server.onrender.com/api/profile",
        { certifications: updatedCert },
        { headers: { Authorization: token } }
      );

      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const resetExperienceForm = () => {
    setExpForm({
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
    });
    setEditingExpIndex(null);
  };
  const resetEducationForm = () => {
    setEduForm({
      college: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
    });
    setEditingEduIndex(null);
  };

  const resetCertForm = () => {
    setCertForm({
      name: "",
      provider: "",
      url: "",
      id: "",
      issueDate: "",
      expiryDate: "",
      description: "",
    });
    setEditingCertIndex(null);
  };

  const handleEditCertification = (index) => {
    setCertForm(user.certifications[index]);
    setEditingCertIndex(index);
    setShowCertification(true);
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Profile Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex justify-between">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-400" />
            <div>
              <h2 className="text-lg font-semibold">
                {user.name} <span className="text-gray-400"></span>
              </h2>
              <p className="text-blue-500 text-sm">{user.email}</p>
              {user.resume && (
                <a
                  href={user.resume.replace("/upload/", "/upload/fl_attachment/")}
                  download={`${user.firstName}_resume.pdf`}
                  className=" text-blue-500 text-sm rounded"
                >
                  Download Resume
                </a>


              )}

            </div>
          </div>

          <div className="text-right">
            <p className="text-gray-400 text-sm">League</p>
            <p>Bronze</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="space-y-6">

            {/* Progress */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
              <h3 className="font-semibold">
                Level Up Profile
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Progress {percent}%
              </p>

              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>


            {/* bio */}
            {/* bio */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold">Bio</h3>
                <button
                  onClick={() => {
                    setProfileForm({
                      firstName: user.firstName || "",
                      lastName: user.lastName || "",
                      location: user.location || "",
                      bio: user.bio || "",
                    });
                    setShowBio(true);
                  }}
                  className="text-gray-400 text-sm"
                >
                  +
                </button>
              </div>

              {user.bio ? (
                <p className="text-sm text-gray-600 mt-3">
                  {user.bio}
                </p>
              ) : (
                <p className="text-gray-400 mt-3 text-sm">
                  Add your Bio!
                </p>
              )}
            </div>



            {/* Skills */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold">Skills</h3>
                <button
                  onClick={() => {
                    setSelectedSkills(user.skills || []);
                    setShowSkills(true);
                  }}
                  className="text-gray-400 text-xl"
                >
                  +
                </button>

              </div>

              {user.skills?.length ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  {user.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 mt-3 text-sm">
                  Add your skills!
                </p>
              )}
            </div>


          </div>

          {/* RIGHT */}
          <div className="md:col-span-2 space-y-6">

            {/* Experience */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold">Experience</h3>
                <button
                  onClick={() => {
                    resetExperienceForm();
                    setShowExperience(true);
                  }}
                  className="text-gray-400 text-xl"
                >
                  +
                </button>
              </div>

              {user.experience?.length ? (
                <div className="mt-3 space-y-2">
                  {user.experience.map((exp, i) => (
                    <div
                      key={i}
                      className="p-3 rounded bg-gray-100 dark:bg-gray-700 flex justify-between items-start"
                    >
                      <div>
                        <p className="font-semibold">{exp.role}</p>
                        <p className="text-sm text-gray-500">
                          {exp.company} • {exp.location}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setExpForm(user.experience[i]); // existing data load
                            setEditingExpIndex(i);          // set edit mode
                            setShowExperience(true);        // open modal
                          }}
                          className="text-blue-500 text-sm"
                        >
                          Edit
                        </button>


                        <button
                          onClick={() => handleDeleteExperience(i)}
                          className="text-red-500 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}


                </div>
              ) : (
                <p className="text-gray-400 text-sm mt-3">
                  Add your experiences!
                </p>
              )}
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold">Education</h3>
                <button
                  onClick={() => {
                    resetEducationForm();
                    setShowEducation(true);
                  }}
                  className="text-gray-400 text-xl"
                >
                  +
                </button>
              </div>

              {user.education?.length ? (
                <div className="mt-3 space-y-2">
                  {user.education.map((edu, i) => (
                    <div
                      key={i}
                      className="p-3 rounded bg-gray-100 dark:bg-gray-700 flex justify-between items-start"
                    >
                      <div>
                        <p className="font-semibold">{edu.degree}</p>
                        <p className="text-sm text-gray-500">
                          {edu.college} • {edu.location}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button className="text-blue-500 text-sm"
                          onClick={() => {
                            setEduForm(edu);
                            setEditingEduIndex(i);
                            setShowEducation(true);
                          }}
                        >
                          Edit
                        </button>


                        <button
                          onClick={() => handleDeleteEducation(i)}
                          className="text-red-500 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}


                </div>
              ) : (
                <p className="text-gray-400 text-sm mt-3">
                  Add your education!
                </p>
              )}
            </div>

            {/* certification */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold">Certification</h3>
                <button
                  onClick={() => setShowCertification(true)}
                  className="text-gray-400 text-xl"
                >
                  +
                </button>

              </div>

              {user.certifications?.length ? (
                <div className="mt-3 space-y-2">
                  {user.certifications.map((cert, i) => (
                    <div
                      key={i}
                      className="p-3 rounded bg-gray-100 dark:bg-gray-700 flex justify-between items-start"
                    >
                      <div>
                        <p className="font-semibold">{cert.name}</p>
                        <p className="text-sm text-gray-500">
                          {cert.provider}
                        </p>
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 text-sm underline"
                          >
                            Certificate Link
                          </a>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="text-blue-500 text-sm"
                          onClick={() => {
                            setCertForm(user.certifications[i]);
                            setEditingCertIndex(i);
                            setShowCertification(true);
                          }}
                        >
                          Edit
                        </button>


                        <button
                          onClick={() => handleDeleteCertification(i)}
                          className="text-red-500 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}


                </div>
              ) : (
                <p className="text-gray-400 text-sm mt-3">
                  Add your Certificate!
                </p>
              )}

            </div>


          </div>
        </div>
      </div>

      {/* EDUCATION MODAL */}
      {showEducation && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowEducation(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">
              Add Your Education
            </h2>

            <div className="space-y-3">
              {/* College */}
              <input
                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="College"
                value={eduForm.college}
                onChange={(e) =>
                  setEduForm({ ...eduForm, college: e.target.value })
                }
              />

              {/* Degree */}
              <input
                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Degree"
                value={eduForm.degree}
                onChange={(e) =>
                  setEduForm({ ...eduForm, degree: e.target.value })
                }
              />

              {/* Field */}
              <input
                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Field of Study"
                value={eduForm.field}
                onChange={(e) =>
                  setEduForm({ ...eduForm, field: e.target.value })
                }
              />

              {/* Location */}
              <input
                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Location"
                value={eduForm.location}
                onChange={(e) =>
                  setEduForm({ ...eduForm, location: e.target.value })
                }
              />

              {/* Start Date */}
              <input
                type="date"
                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                value={eduForm.startDate}
                onChange={(e) =>
                  setEduForm({ ...eduForm, startDate: e.target.value })
                }
              />

              {/* Currently studying */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={eduForm.current}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, current: e.target.checked })
                  }
                />
                Currently studying here
              </label>

              {/* End Date */}
              {!eduForm.current && (
                <input
                  type="date"
                  className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                  value={eduForm.endDate}
                  onChange={(e) =>
                    setEduForm({ ...eduForm, endDate: e.target.value })
                  }
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEducation(false);
                  resetEducationForm();
                }}
              >
                Cancel
              </button>


              <button
                onClick={handleSaveEducation}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {editingEduIndex !== null ? "Update" : "Add"}
              </button>

            </div>
          </div>
        </div>
      )}


      {/* EXPERIENCE MODAL */}
      {showExperience && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowExperience(false)}
        >
          <div
            className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-5">
              Add Experience
            </h2>

            <div className="space-y-4">

              <div>
                <label className="text-sm font-medium block mb-1">
                  Role *
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={expForm.role}
                  onChange={(e) =>
                    setExpForm({ ...expForm, role: e.target.value })
                  }
                />

              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Company Name *
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={expForm.company}
                  onChange={(e) =>
                    setExpForm({ ...expForm, company: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Location
                </label>
                <input
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    setExpForm({ ...expForm, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Date of joining
                </label>
                <input
                  type="date"
                  value={expForm.startDate}
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    setExpForm({ ...expForm, startDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Date of leaving
                </label>
                <input
                  type="date"
                  value={expForm.endDate}
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    setExpForm({ ...expForm, endDate: e.target.value })
                  }
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={expForm.current}
                  onChange={(e) =>
                    setExpForm({ ...expForm, current: e.target.checked })
                  }
                />
                Currently working in this role
              </label>

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowExperience(false);
                  resetExperienceForm();
                }}
                className="px-4 py-2 text-gray-600 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExperience}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {editingExpIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATION MODAL */}
      {showCertification && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowCertification(false)}
        >
          <div
            className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-5">
              Add Certification
            </h2>

            <div className="space-y-4">

              <div>
                <label className="text-sm font-medium block mb-1">
                  Certification *
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={certForm.name}
                  onChange={(e) =>
                    setCertForm({ ...certForm, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Provider *
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={certForm.provider}
                  onChange={(e) =>
                    setCertForm({ ...certForm, provider: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Certificate URL
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={certForm.url}
                  onChange={(e) =>
                    setCertForm({ ...certForm, url: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Certificate ID
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={certForm.id}
                  onChange={(e) =>
                    setCertForm({ ...certForm, id: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Issued Date
                </label>
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={certForm.issueDate}
                  onChange={(e) =>
                    setCertForm({ ...certForm, issueDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={certForm.expiryDate}
                  onChange={(e) =>
                    setCertForm({ ...certForm, expiryDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows="3"
                  value={certForm.description}
                  onChange={(e) =>
                    setCertForm({
                      ...certForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>


            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCertification(false);
                  resetCertForm();
                }}
              >
                Cancel
              </button>


              <button
                onClick={handleSaveCertification}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {editingCertIndex !== null ? "Update" : "Add"}
              </button>



            </div>

          </div>

        </div>
      )}

      {/* skill */}

      {showSkills && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowSkills(false)}
        >
          <div
            className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Skills</h2>

            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-gray-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Input */}
            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Search skills"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
            />

            {/* Suggestions */}
            <div className="max-h-40 overflow-y-auto border rounded">
              {skillOptions
                .filter((s) =>
                  s.toLowerCase().includes(skillInput.toLowerCase())
                )
                .map((skill, i) => (
                  <div
                    key={i}
                    onClick={() => handleAddSkill(skill)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {skill}
                  </div>
                ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSkills(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveSkills}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* bio */}
      {showBio && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => {
            setShowBio(false);
            setProfileForm(user);
            setResumeFile(null);
          }}
        >
          <div
            className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-yellow-400 relative">
                <div className="absolute bottom-1 right-1 bg-blue-500 w-5 h-5 rounded-full border-2 border-white" />
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3">
              {/* First Name */}
              <div>
                <label className="text-sm">First Name *</label>
                <input
                  className="w-full border p-2 rounded"
                  value={profileForm.firstName || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="text-sm">Last Name *</label>
                <input
                  className="w-full border p-2 rounded"
                  value={profileForm.lastName || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Email (read only) */}
              <div>
                <label className="text-sm">Email ID *</label>
                <input
                  className="w-full border p-2 rounded bg-gray-100"
                  value={user.email}
                  disabled
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm">Location</label>
                <input
                  className="w-full border p-2 rounded"
                  value={profileForm.location || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              {/* Bio with AI icon */}
              <div>
                <label className="text-sm">Bio</label>
                <div className="relative">
                  <textarea
                    rows={3}
                    className="w-full border p-2 pr-10 rounded"
                    value={profileForm.bio || ""}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        bio: e.target.value,
                      })
                    }
                  />

                  <button
                    type="button"
                    onClick={generateBio}
                    className="absolute right-2 top-2 text-gray-500 hover:text-blue-600"
                    title="Generate AI Bio"
                  >
                    ✨
                  </button>
                </div>
              </div>

              {/* Resume upload */}
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  setResumeFile(e.dataTransfer.files[0]);
                }}
              >
                <p className="text-gray-400">
                  {resumeFile
                    ? resumeFile.name
                    : "Drag & drop resume or click to upload"}
                </p>

                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowBio(false);
                  setProfileForm(user);
                  setResumeFile(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}

export default Profile;
