// import Link from "next/link";

import AdminLayout from "Components/Common/Layout/AdminLayout/AdminLayout";

// import Eye from "@Img/eye_icon.png";

class AdminMain extends React.Component {
  state = {};

  render() {
    return (
      <AdminLayout>
        <div className="admin_section admin_post_list_wrapper">
          <div className="admin_content_title">관리자 메인</div>
          <div className="admin_content">관리자 메인페이지</div>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminMain;
