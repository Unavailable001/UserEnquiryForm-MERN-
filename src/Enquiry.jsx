import axios from "axios";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow
} from "flowbite-react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default function Enquiry() {
    let [enquiryList, setEnquiryList] = useState([]);
    let [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        _id: "",
    });

    // SAVE / UPDATE ENQUIRY
    let saveEnquiry = (e) => {
        e.preventDefault();

        if (formData._id) {
            axios.put(`http://localhost:8020/api/website/enquiry/update/${formData._id}`, formData)
                .then(() => {
                    toast.success("Enquiry Updated Successfully");
                    setFormData({ name: "", email: "", phone: "", message: "", _id: "" });
                    getAllEnquiry();
                });
        } else {
            axios.post(`http://localhost:8020/api/website/enquiry/insert`, formData)
                .then(() => {
                    toast.success("Enquiry Saved Successfully");
                    setFormData({ name: "", email: "", phone: "", message: "", _id: "" });
                    getAllEnquiry();
                });
        }
    };

    // GET ALL DATA
    let getAllEnquiry = () => {
        axios.get(`http://localhost:8020/api/website/enquiry/view`)
            .then((res) => res.data)
            .then((finalData) => {
                if (finalData.status) {
                    setEnquiryList(finalData.enquiryList);
                }
            });
    };

    let getValue = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        getAllEnquiry();
    }, []);

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <ToastContainer />

            <h1 className="text-4xl text-center py-6 font-extrabold tracking-wide text-gray-800">
                User Enquiry Portal
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-[35%_auto] gap-10">

                {/* FORM CARD */}
                <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
                    <h2 className="text-xl mb-4 font-semibold text-gray-700">
                        Enquiry Form
                    </h2>

                    <form onSubmit={saveEnquiry} className="space-y-4">

                        <div>
                            <Label value="Your Name" className="text-gray-600" />
                            <TextInput
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={getValue}
                                placeholder="Enter Your Name"
                                required
                            />
                        </div>

                        <div>
                            <Label value="Your Email" className="text-gray-600" />
                            <TextInput
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={getValue}
                                placeholder="Enter Your Email"
                                required
                            />
                        </div>

                        <div>
                            <Label value="Your Phone" className="text-gray-600" />
                            <TextInput
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={getValue}
                                placeholder="Enter Your Phone"
                                required
                            />
                        </div>

                        <div>
                            <Label value="Your Message" className="text-gray-600" />
                            <Textarea
                                name="message"
                                value={formData.message}
                                onChange={getValue}
                                placeholder="Write your message..."
                                rows={4}
                                required
                            />
                        </div>

                        {/* CLASSIC SAVE BUTTON */}
                        <button
                            type="submit"
                            className="w-full py-2 mt-2 text-lg font-semibold text-white 
                                       bg-gray-700 rounded-lg hover:bg-gray-800 transition">
                            {formData._id ? "Update Enquiry" : "Save Enquiry"}
                        </button>

                    </form>
                </div>

                {/* LIST */}
                <EnquiryList
                    data={enquiryList}
                    getAllEnquiry={getAllEnquiry}
                    Swal={Swal}
                    setFormData={setFormData}
                />
            </div>
        </div>
    );
}

function EnquiryList({ data, getAllEnquiry, Swal, setFormData }) {
    
    let deleteRow = (delId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#dc2626",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8020/api/website/enquiry/delete/${delId}`)
                    .then(() => {
                        toast.success("Enquiry deleted successfully");
                        getAllEnquiry();
                    });
            }
        });
    };

    let editRow = (item) => {
        axios.get(`http://localhost:8020/api/website/enquiry/single/${item._id}`)
            .then((res) => {
                let data = res.data.enquiry;
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    message: data.message,
                    _id: data._id,
                });
            });
    };

    return (
        <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl mb-4 font-semibold text-gray-700">
                Enquiry List
            </h2>

            <div className="overflow-x-auto rounded-lg">
                <Table hoverable striped>
                    <TableHead>
                        <TableRow className="bg-gray-200">
                            <TableHeadCell>#</TableHeadCell>
                            <TableHeadCell>Name</TableHeadCell>
                            <TableHeadCell>Email</TableHeadCell>
                            <TableHeadCell>Phone</TableHeadCell>
                            <TableHeadCell>Message</TableHeadCell>
                            <TableHeadCell>Edit</TableHeadCell>
                            <TableHeadCell>Delete</TableHeadCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <TableRow key={item._id} className="hover:bg-gray-100 transition">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="text-gray-800 font-medium">{item.name}</TableCell>
                                    <TableCell className="text-gray-800">{item.email}</TableCell>
                                    <TableCell className="text-gray-800">{item.phone}</TableCell>
                                    <TableCell className="text-gray-800">{item.message}</TableCell>

                                    <TableCell>
                                        <button
                                            className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                                            onClick={() => editRow(item)}
                                        >
                                            Edit
                                        </button>
                                    </TableCell>

                                    <TableCell>
                                        <button
                                            className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition"
                                            onClick={() => deleteRow(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-gray-600 py-4">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
