import axios from "axios";
import closeIcon from "../photos/close.png";
import { useState, useEffect } from "react";
import DefaultURL from "../usefull/DefaultURL";
import { useNavigate, useParams } from "react-router";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";

import Alert from "../components/Alert";
import TitleInput from "../components/articleFormComponents/TitleInput";
import BodyTextInput from "../components/articleFormComponents/BodyTextInput";
import CategoriesSelect from "../components/articleFormComponents/CategoriesSelect";
import ThumbnailDescription from "../components/articleFormComponents/ThumbnailDescription";

export default function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [titleCurrent, setTitleCurrent] = useState("");
  const [currentArticle, setCurrentArticle] = useState(null);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);
  const [selectDisabled, setSelectDisabled] = useState(false);
  const [categoriesCurrent, setCategoriesCurrent] = useState([]);

  useEffect(() => {
    const getArticleById = async () => {
      const response = await axios.get(`${DefaultURL}/article/${id}`);
      const data = response.data;
      setCurrentArticle(data);
      setTitleCurrent(data.title);
      setCategoriesCurrent(data.categories);
      setSelectDisabled(data.categories.length === 3);
    };

    getArticleById();
  }, []);

  useEffect(() => {
    setSelectDisabled(categoriesCurrent.length === 3);
  }, [categoriesCurrent]);

  const updateTitleLive = (e) => {
    setTitleCurrent(e.target.value);
  };

  const deleteCategoryLive = (e) => {
    setCategoriesCurrent(categoriesCurrent.filter((i) => i.id != e.id));
    setSelectDisabled(categoriesCurrent.length === 3);
  };

  const addCategoryLive = (e) => {
    if (categoriesCurrent.length < 3) {
      setCategoriesCurrent((prevCategories) => [...prevCategories, e.value]);
    }
  };

  const onSubmit = async (values) => {
    try {
      if (values.country !== "") {
        const response = await axios.post(
          `${DefaultURL}/user/register`,
          values
        );

        if (response.data !== "") {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          setShowAlert(true);
          setAlertInfos([
            "Congratulations!",
            "You have been Succesfully Registered!",
            "success",
          ]);
        } else {
          setShowAlert(true);
          setAlertInfos([
            "Be Careful",
            "Email or UserName Already Registered!",
            "danger",
          ]);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
      } else {
        setShowAlert(true);
        setAlertInfos([
          "Be Careful",
          "The Residence Country Must Be Specified!",
          "danger",
        ]);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const registerData = {
      name: formData.get("nameInput"),
      email: formData.get("emailInput"),
      country: formData.get("countryInput"),
      password: formData.get("passwordInput"),
      phoneNumber: formData.get("phoneNumberInput"),
      shortAutoDescription: formData.get("shortAutoDescriptionInput"),
    };
    onSubmit(registerData);
  };

  return (
    <div className="container-xl mt-3">
      {showAlert && (
        <Alert
          type={alertInfos[0]}
          message={alertInfos[1]}
          color={alertInfos[2]}
        />
      )}

      <div className="row">
        <form onSubmit={onSave} className="container-xl col-xl-6 col-md-12">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-md-8 col-lg-6 col-xl-10">
              <div className="border border-danger">
                <div
                  className="card-body p-4 text-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255,0.5)",
                    wordWrap: "break-word",
                  }}
                >
                  <h1 className="mb-4">
                    Edit Article <br></br>"{titleCurrent}"
                  </h1>
                  <hr style={{ color: "#dc3545" }} />

                  <div className="form-outline mb-4">
                    <TitleInput
                      article={currentArticle}
                      id={"floatingNameValue"}
                      updateTitleLive={updateTitleLive}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <ThumbnailDescription
                      article={currentArticle}
                      id={"floatingThumbnailDescriptionValue"}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <h2>Categories</h2>
                    <div className="mb-3">
                      {categoriesCurrent.map((e) => (
                        <div
                          className="border border-success border-3 rounded-pill ms-3"
                          style={{ display: "inline-block" }}
                          key={e.id}
                        >
                          <h5 className="d-inline me-2 ms-2">
                            {FirstLetterUppercase(e.nameOfCategory)}
                          </h5>
                          <input
                            className="d-inline mt-1 me-2"
                            type="image"
                            src={closeIcon}
                            style={{ width: "22px" }}
                            onClick={() => deleteCategoryLive(e)}
                          />
                        </div>
                      ))}
                    </div>
                    <CategoriesSelect
                      id={"floatingCategoriesSelectValue"}
                      action={addCategoryLive}
                      disabled={selectDisabled}
                      currentChosenCategs={categoriesCurrent}
                    />
                  </div>

                  <button
                    className="btn btn-success btn-lg btn-block"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="col-xl-6 col-md-12">
          <BodyTextInput
            article={currentArticle}
            id={"floatingBodyTextValue"}
          />
        </div>
      </div>
    </div>
  );
}
