import LoaderCreateArticle from "../components/LoaderCreateArticle";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import addArticleIcon from "../photos/addArticleIcon.png";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthHeader } from "react-auth-kit";
import DefaultURL from "../usefull/DefaultURL";
import { useState, useEffect } from "react";
import ErrorPage from "./ErrorPage";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default function PostArticlePage() {
  const { id } = useParams();
  const token = useAuthHeader();
  const navigate = useNavigate();

  const currentUser = CurrentUserInfos();

  const [showLoader, setShowLoader] = useState(false);
  const [allUserArticles, setAllUserArticles] = useState(null);

  useEffect(() => {
    const getAllArticles = async () => {
      const res = await axios.get(`${DefaultURL}/article/user/${id}`);
      setAllUserArticles(res.data);
    };

    getAllArticles();
  }, []);

  const createNewArticle = async () => {
    try {
      const uuid = uuidv4().toString();
      const headers = { Authorization: token() };

      await axios.post(
        `${DefaultURL}/article`,
        {
          uuid: uuid,
          owner: { id: currentUser?.id },
        },
        { headers }
      );

      setShowLoader(true);
      setTimeout(() => {
        navigate(`/edit-article/${uuid}`);
      }, 3500);
    } catch (error) {
      console.error("Request error:", error);
      // navigate("/an-error-has-occured");
    }
  };

  return (
    <div className="container-xl">
      {showLoader ? (
        <LoaderCreateArticle />
      ) : (
        <>
          {currentUser?.id == id ? (
            <div className="row">
              {allUserArticles?.map((e) => (
                <div
                  className="card border-danger col-xl-3 col-lg-4 col-md-6 mx-auto mt-4"
                  style={{ width: "18rem" }}
                >
                  <img
                    src={addArticleIcon}
                    className="card-img-top"
                    style={{ padding: "25px", width: "256px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{e.title}</h5>
                    <hr />
                    <p className="card-text">
                      {e.thumbnailDescription?.length > 95
                        ? e.thumbnailDescription.substring(0, 96) + "..."
                        : e.thumbnailDescription}
                    </p>
                  </div>
                </div>
              ))}

              <div
                className="card border-danger col-xl-3 col-lg-4 col-sm-1 mx-auto mt-4"
                style={{ width: "18rem" }}
              >
                <button
                  className="card"
                  onClick={createNewArticle}
                  style={{ border: "none", background: "none", padding: "0" }}
                >
                  <img
                    src={addArticleIcon}
                    className="card-img-top"
                    style={{ padding: "25px" }}
                  />

                  <div className="card-body">
                    <h5 className="card-title">Start a New Article</h5>
                    <hr />
                    <p className="card-text">
                      Start a new Article NOW for FREE and spread your message
                      to the world easier than ever!
                    </p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <ErrorPage />
          )}
        </>
      )}
    </div>
  );
}
