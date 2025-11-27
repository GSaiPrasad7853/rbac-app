import React from "react";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="page">
      <h2>Unauthorized</h2>
      <p>You do not have permission to access this page.</p>
      <Link to="/login">Go to login</Link>
    </div>
  );
}
