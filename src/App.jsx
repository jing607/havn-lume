import axios from "axios";
import { useState } from "react";
const { VITE_BASE_URL: baseUrl, VITE_API_PATH: apiPath } = import.meta.env;

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  const [account, setAccount] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setAccount({
      ...account,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/v2/admin/signin`, account);
      const { token, expired } = response.data;

      // if (!token || !expired) {
      //   throw new Error("帳號或密碼錯誤");
      // }
      document.cookie = `hjToken=${token}; expires=${new Date(expired)}`;
      
      axios.defaults.headers.common['Authorization'] = token;
      
      getProducts();
      setIsAuth(true);
      console.log(response);
    } catch (error) {
      alert("登入失敗：" + error.message);
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v2/api/${apiPath}/admin/products`)
      setProducts(response.data.products);
      
    } catch (error) {
      alert("取得產品列表失敗：" + error.message);
    }
  }

  const checkUserLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
      alert("使用者已登入");
    } catch (error) {
      alert("檢查使用者登入狀態失敗：" + error.message);
    }
  }

  return (
    <>
      {isAuth ? (
        <div className="container">
          <button onClick={checkUserLogin} className="btn btn-success mt-5">檢查使用者是否登入</button>
          <div className="row mt-5">
            <div className="col-md-6">
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.title}</td>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>
                        {product.is_enabled ? (
                          <span className="text-success">已啟用</span>
                        ) : (
                          <span className="text-danger">未啟用</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setTempProduct(product);
                          }}
                        >
                          查看細節
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h2>單一產品細節</h2>
              {tempProduct ? (
                <div className="card mb-3">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top primary-image"
                    alt="主圖"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge bg-primary ms-2">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.description}
                    </p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <div className="d-flex">
                      <p className="card-text text-secondary">
                        <del>{tempProduct.origin_price}</del>
                      </p>
                      元 / {tempProduct.price} 元
                    </div>
                    <h5 className="mt-3">更多圖片：</h5>
                    <div className="d-flex flex-wrap">
                      {tempProduct.imagesUrl?.map((image, index) => (
                        image && (
                          <img
                            src={image}
                            key={index}
                            className="card-img-top primary-image"
                            alt="更多圖片"
                          />
                        )
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-secondary">請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input
                value={account.username}
                onChange={handleInputChange}
                name="username"
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                value={account.password}
                onChange={handleInputChange}
                name="password"
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary">登入</button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  );
}

export default App;
