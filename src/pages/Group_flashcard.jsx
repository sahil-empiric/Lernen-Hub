import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { ipaddress2, ipaddress } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { Context } from '../context/Context_provider'
import Backtotop from './Backtotop'
import axiosInstance from './axiosInstance'
import * as bootstrap from 'bootstrap';
import { setEncryptedData,getDecryptedData,removeData } from '../utils/helperFunctions';

const Group_flashcard = () => {

  let { translate_value, addsubjects_layout, setgroup_visible, setstudylist_visible, setcourse_visible, navbar_dropdown_visible, setnavbar_dropdown_visible } = useContext(Context)

  const { group_id } = useContext(Context)
  const navigate = useNavigate()

  const user = JSON.parse(getDecryptedData('user'))
  const [count, setCount] = useState(0)
  const [courseid, setCourseid] = useState(0)
  const [flashcards_layout_status, setflashcards_layout_status] = useState(false)

  const courseData = (e) => {
    setCourseid(e.target.value)
  }
  const [semesterid, setSemesterid] = useState(0)
  const semesterId = (e) => {
    setSemesterid(e.target.value)
  }
  const [name, setName] = useState("")
  const nameData = (e) => {
    setName(e.target.value)
  }
  const [description, setDescription] = useState("")
  const descriptionData = (e) => {
    setDescription(e.target.value)
  }
  const [professor, setProfessor] = useState("")
  const professorData = (e) => {
    setProfessor(e.target.value)
  }
  const [tagname, setTagname] = useState("")
  const tagnameData = (e) => {
    setTagname(e.target.value)
  }
  const [language, setLanguage] = useState("")
  const languageData = (e) => {
    setLanguage(e.target.value)
  }
  const [scope, setScope] = useState("")
  const scopeData = (e) => {
    setScope(e.target.value)
  }
  const [term, setTerm] = useState("")
  const termData = (e) => {
    setTerm(e.target.value)
  }
  const [definition, setDefinition] = useState("")
  const definitionData = (e) => {
    setDefinition(e.target.value)
  }

  const [flashsetId, setFlashsetId] = useState({})
  const sendflashcardset = () => {
    const formdata = new FormData()
    formdata.append('name', name)
    formdata.append('professor_name', professor)
    formdata.append('tags', tagname)
    formdata.append('description', description)
    formdata.append('language', language)
    formdata.append('scope', scope)
    axiosInstance.post(`${ipaddress}/Groupflashcardsets/create/${user.user_id}/${group_id}/${semesterid}/`, formdata)
      .then((r) => {
        console.log("Group Flashset sent successfully", r.data)
        setFlashsetId(r.data.flashset_id)
        const toastLiveExample = document.getElementById('liveToast')
        document.getElementById('toastbody').style.color = "green"
        document.getElementById('toastbody').textContent = "Flashset Successfully Created !!!"
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
        setName("")
        setProfessor("")
        setTagname("")
        setDescription("")
        setLanguage("")
        setScope("")
        setSemesterid(0)
        setCourseid(0)
        setflashcards_layout_status(true)
      })
      .catch(() => {
        console.log("Group Flashset sent error", group_id)
      })
  }

  const [semesterdata, setSemesterdata] = useState([])

  useEffect(() => {
    const organization = JSON.parse(getDecryptedData('user'))

    axiosInstance.get(`${ipaddress2}/Semesters/`)
      .then((p) => {
        setSemesterdata(p.data)
        // console.log("Semester data :",p.data)
      })
  }, [])

  // ------------------------------------ADD MORE FLASH CARD AND SEND TO BACKEND-------------------------------------------
  const [flashcards, setFlashcards] = useState([
    { term: '', definition: '', t_image: null, d_image: null }
  ]);

  const handleInputChange = (index, event) => {
    const { name, value, files } = event.target;
    const newFlashcards = [...flashcards];
    if (files) {
      newFlashcards[index][name] = files[0]; // Assuming only one file is selected
    } else {
      newFlashcards[index][name] = value;
    }
    setFlashcards(newFlashcards);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      flashcards.forEach((flashcard, index) => {
        formData.append(`flashcards[${index}].t_image`, flashcard.t_image);
        formData.append(`flashcards[${index}].term`, flashcard.term);
        formData.append(`flashcards[${index}].definition`, flashcard.definition);

        formData.append(`flashcards[${index}].d_image`, flashcard.d_image);
      });

      const response = await axiosInstance.post(`${ipaddress2}/Add_flashcard/${flashsetId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setCount(count + 1)
      const toastLiveExample = document.getElementById('liveToast')
      document.getElementById('toastbody').style.color = "green"
      document.getElementById('toastbody').textContent = "Flashcards Successfully Added !!!"
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
      toastBootstrap.show()
      setFlashcards([
        { term: '', definition: '', t_image: null, d_image: null }
      ])
      console.log(response.data);
      setTimeout(() => {
        navigate('/dashboard/page')
      }, 2000)
    } catch (error) {
      console.error('Error:', flashcards);
    }
  };

  const addFlashcard = () => {
    setFlashcards([...flashcards, { term: '', definition: '', t_image: null, d_image: null }]);
  };
  return (
    <div className='d-flex'>
      
      <div onClick={() => {
        setcourse_visible(false)
        setgroup_visible(false)
        setstudylist_visible(false)
      }} className="w-100 pt-5 mt-4 bg-light main-division d-flex flex-column align-items-center px-3 px-lg-0">
        
        <div onClick={() => {
          setnavbar_dropdown_visible(false)
        }} className='w-100'>
          <div className="p-4">
            <div className='row bg-white justify-content-center'>
              <div className="col-md-9 bg-white">
                <div className='px-2 p-3 rounded row '>
                  <h5 className='text-center pb-3'>Create Your Flashset</h5>
                  <div className="col-md-6 mb-3">
                    <input type="text" name='name' className='form-control ps-4 bg-light' style={{ height: '50px' }} placeholder='Name of the Flashcard' onChange={nameData} value={name} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <select
                      name="semester"
                      className="form-select form-select-md px-5 ps-4 shadow-none bg-light" style={{ height: '50px' }}
                      aria-label="Large select example"
                      onChange={semesterId}
                      value={semesterid}
                    >
                      <option value="" selected>Select Semester</option>
                      {semesterdata.map((x, index) => {
                        return (
                          <option key={index} value={x.semester_id}>{x.sem_name}</option>
                        )
                      })}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="text" name='professor_name' className='form-control ps-4 bg-light' style={{ height: '50px' }} placeholder='Professor Name' onChange={professorData} value={professor} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="text" name='tags' className='form-control ps-4 bg-light' style={{ height: '50px' }} placeholder='Tag Name' onChange={tagnameData} value={tagname} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="text" name='description' className='form-control ps-4 bg-light' style={{ height: '50px' }} placeholder='Description' onChange={descriptionData} value={description} />
                  </div>
                  <div className="col-md-6 mb-3 mb-md-0">
                    <select
                      name="language"
                      className="form-select form-select-md px-5 ps-4 shadow-none bg-light" style={{ height: '50px' }}
                      aria-label="Large select example"
                      onChange={languageData}
                      value={language}
                    >
                      <option value="" selected>Select Language</option>
                      <option value="DE">German</option>
                      <option value="EN">English</option>
                    </select>
                  </div>
                  <div className="col-md-6 ms-auto mb-2 mb-md-0">
                    <select
                      name="scope"
                      className="form-select form-select-md px-5 ps-4 shadow-none bg-light" style={{ height: '50px' }}
                      aria-label="Large select example"
                      onChange={scopeData}
                      value={scope}
                    >
                      <option value="" selected>Select Scope</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className='text-end mt-3'>
                    <button className='btn fw-medium text-white' style={{ backgroundColor: '#5d5fe3' }} onClick={sendflashcardset}>Create Flashset</button>
                  </div>
                </div>
              </div>


              <div className='col-md-2 d-flex justify-content-center align-items-center'>
                <img src={require('../img/images_icons/mascot1.png')} style={{ height: '300px' }} alt="grp-flash" />
              </div>
            </div>


          </div>

          {/* -------------------------------------------Create Flashcards layout section----------------------------------------- */}
          <div className={`container my-4 ${flashcards_layout_status ? '' : 'd-none'}`}>
            <form onSubmit={handleSubmit} className=''>
              {flashcards.map((flashcard, index) => (
                <div key={index}>
                  <div className="row m-0 mt-3">
                    <div className="col-md-12 col-lg-6">
                      <textarea style={{ fontSize: '14px' }} className='w-100 py-3 form-control mb-2' type="text" name="term" value={flashcard.term} onChange={(event) => handleInputChange(index, event)} />
                      <input type="file" name="t_image" onChange={(event) => handleInputChange(index, event)} id={`t_image_${index}`} />
                      <label style={{ backgroundColor: '#5D5FE3', fontSize: '14px', cursor: 'pointer' }} className='text-white p-1 px-3 rounded-pill bg-gradient' htmlFor={`t_image_${index}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z" />
                          <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                        </svg><span className='ms-2'>Upload Image</span>
                      </label>
                      {flashcard.t_image && (
                        <img className='ms-3 rounded'
                          src={URL.createObjectURL(flashcard.t_image)}
                          alt='Uploaded Image'
                          style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }}
                        />
                      )}
                    </div>
                    <div className="col-md-12 col-lg-6">
                      <textarea style={{ fontSize: '14px' }} className='w-100 py-3 form-control mb-2' type="text" name="definition" value={flashcard.definition} onChange={(event) => handleInputChange(index, event)} />
                      <input type="file" name="d_image" onChange={(event) => handleInputChange(index, event)} id={`d_image_${index}`} />
                      <label style={{ backgroundColor: '#5D5FE3', fontSize: '14px', cursor: 'pointer' }} className='text-white p-1 px-3 rounded-pill bg-gradient' htmlFor={`d_image_${index}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z" />
                        <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                      </svg><span className='ms-2'>Upload Image</span></label>
                      {flashcard.d_image && (
                        <img className='ms-3 rounded'
                          src={URL.createObjectURL(flashcard.d_image)}
                          alt='Uploaded Image'
                          style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className='text-end mt-3'>
                <button className='btn btn-sm  text-white fw-medium' style={{ backgroundColor: '#5D5FE3', fontSize: '14px' }} type="button" onClick={addFlashcard}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg><span className='ms-2'>Add Flashcard</span></button>
                <button className='btn btn-sm  ms-3 text-white fw-medium' style={{ backgroundColor: '#5D5FE3', fontSize: '14px' }} type="submit">Submit</button>
              </div>
            </form>

          </div>
        </div>
        {/* </div> */}
      </div>

      {/* TOAST MESSAGE */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">

          <div className="toast-body d-flex justify-content-between align-items-center">
            <span id='toastbody' className='fw-medium p-2'></span>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>

      <Backtotop />
    </div>
  )
}

export default Group_flashcard