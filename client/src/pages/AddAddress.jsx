import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const AddAddress = () => {
  const { axios, navigate } = useAppContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("Submitting address:", formData);

    try {
      const { data } = await axios.post(
        "/api/address/add",
        formData,
        { withCredentials: true }   // ⬅️ IMPORTANT
      );

      if (data.success) {
        toast.success("Address saved successfully");
        navigate("/cart"); // or wherever you want to go next
      } else {
        toast.error(data.message || "Failed to save address");
      }
    } catch (error) {
      console.error("Add address error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to save address"
      );
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      {/* your existing form inputs, just make sure they use name= and onChange */}
      {/* example: */}
      <input
        name="firstName"
        value={formData.firstName}
        onChange={onChangeHandler}
        placeholder="First Name"
      />
      {/* ...rest of fields... */}
      <button type="submit">SAVE ADDRESS</button>
    </form>
  );
};

export default AddAddress;
