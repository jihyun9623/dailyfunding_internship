import Link from "next/link";

import AdminLayout from "Components/Common/Layout/AdminLayout/AdminLayout";

import "./index.scss";

class AdminMain extends React.Component {
  state = {};

  render() {
    return (
      <AdminLayout>
        <div className="admin_section admin_main_wrapper">
          <div className="admin_content_title">관리자 메인</div>
          <div className="admin_content">
            <Link href="/admin/post">
              <button className="admin_main_btn">
                포스트
                <br />
                관리
              </button>
            </Link>
            <Link href="/admin/category">
              <button className="admin_main_btn">
                카테고리
                <br />
                관리
              </button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminMain;
