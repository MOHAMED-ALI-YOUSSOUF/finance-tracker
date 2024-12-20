import { currencyFormatter } from "@/lib/utils";
import React, { useEffect, useRef, useContext } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import Modal from "../Modal";
import { financeContext } from "@/lib/store/finance-context";

import { serverTimestamp } from "firebase/firestore";
import { authContext } from "@/lib/store/auth-context";
import { toast } from "react-toastify";
const AddIncomeModal = ({ show, onClose }) => {
  const amountRef = useRef();
  const descriptionRef = useRef();
  const { income, addIncomeItem, removeIncomeItem } =
    useContext(financeContext);
    const {user} = useContext(authContext)
    

  const addIncomeHandler = async (e) => {
    e.preventDefault();
    const newIncome = {
      amount: +amountRef.current.value,
      description: descriptionRef.current.value,
      createdAt: serverTimestamp(), // Save as Firestore Timestamp
      uid: user.uid
    };
    try {
      addIncomeItem(newIncome);
      amountRef.current.value = "";
      descriptionRef.current.value = "";
      toast.success("Income added successfully! ")
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const deleteIncomeEntryHandler = async (incomeId) => {
    try {
      removeIncomeItem(incomeId);
      // toast.success("Income deleted successfully! ")
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <Modal show={show} onClose={() => onClose(false)}>
      <form onSubmit={addIncomeHandler} className="input-group">
        <div className="input-group">
          <label htmlFor="amount">Income Amount</label>
          <input
            ref={amountRef}
            name="amount"
            type="number"
            min={0.01}
            step={0.01}
            placeholder="Enter income amount"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="description">Description</label>
          <input
            ref={descriptionRef}
            name="description"
            type="text"
            placeholder="Enter income description"
            required
          />
        </div>
        <button className="btn btn-primary-outline">Entry Income</button>
      </form>

      <div className="flex flex-col gap-4 mt-6">
        <h3 className="text-2xl font-bold">Income History</h3>
        {income.map((i) => (
          <div key={i.id} className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{i.description}</p>
              <small className="text-xs">{i.createdAt.toISOString()}</small>
            </div>
            <div className="flex items-center gap-2">
              {currencyFormatter(i.amount)}
              <button
                onClick={() => {
                  deleteIncomeEntryHandler(i.id);
                }}
              >
                <FaRegTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default AddIncomeModal;
