import React, { useEffect, useState } from "react";
import { Modal, Table, Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";

const DashContacts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [contacts, setContacts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [contactIdToDelete, setContactIdToDelete] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/contact/getcontact`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        if (res.ok) {
          setContacts(data);
          if (data.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchContacts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    // console.log("type", typeof contacts);

    const startIndex = contacts.length;
    console.log("startindex", startIndex);

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/contact/getcontact?startIndex=${startIndex}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("API response", data);

      if (res.ok) {
        setContacts((prev) => [...prev, ...data.contacts]);
        if (data.contacts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteContact = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/contact/deletecontact/${contactIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setContacts((prev) =>
          prev.filter((contact) => contact._id !== contactIdToDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && contacts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Submitted</Table.HeadCell>
              <Table.HeadCell>Contact content</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {contacts.map((contact) => (
              <Table.Body className="divide-y" key={contact._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(contact.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{contact.content}</Table.Cell>
                  <Table.Cell>{contact.email}</Table.Cell>

                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setContactIdToDelete(contact._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      <MdDeleteOutline size="2em" />
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no contacts yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this contact?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteContact}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashContacts;
