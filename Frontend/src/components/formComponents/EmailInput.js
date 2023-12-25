import { forwardRef } from "react";

function EmailInput({ user, id }, ref) {
  return (
    <div className="form-floating">
      <input
        ref={ref}
        className="form-control"
        type="email"
        name="emailInput"
        id={id}
        placeholder="Email address"
        defaultValue={user?.email}
        required
      />
      <label for={id}>Email address</label>
    </div>
  );
}

export default forwardRef(EmailInput);