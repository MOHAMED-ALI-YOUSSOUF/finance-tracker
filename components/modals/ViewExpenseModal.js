import React, { useContext } from "react";
import Modal from "../Modal";
import { currencyFormatter } from "@/lib/utils";
import { FaRegTrashAlt } from "react-icons/fa";
import { financeContext } from "@/lib/store/finance-context";
import { toast } from "react-toastify";

const ViewExpenseModal = ({ show, onClose, expense }) => {
    const {deleteExpenseItem, deleteExpenseCategory} =useContext(financeContext)
    const deleteExpenseItemHandeler = async(item)=>{
        try {
            //remove the item fron the list
            const updateItems = expense.items.filter((i) => i.id !== item.id)
            // update the expense balance
            const updateExpense = {
                items:[...updateItems],
                total: expense.total - item.amount,
            }
            await deleteExpenseItem(updateExpense, expense.id)
            
        } catch (error) {
            console.log(error.message)
            
        }
    }
    const deleteExpenseHandler = async() =>{
        try {
            await deleteExpenseCategory(expense.id)
        } catch (error) {
            console.log(error.message)
            
        }
    }
  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl">{expense.title}</h2>
        <button onClick={() =>{
            deleteExpenseHandler()
        }} className="btn btn-danger">Delete</button>
      </div>
      <div className="">
        <h3 className="my-4 text-2xl">Expense History</h3>
        {expense.items.map((item) => {
          return (
            <div key={item.id} className="flex items-center justify-between ">
              <small>
                {item.createdAt.toMillis
                  ? new Date(item.createdAt.toMillis()).toISOString()
                  : item.createdAt.toISOString()}
              </small>
              <div className="flex items-center gap-2">

              <p >
                {" "}
                {currencyFormatter(item.amount)}
              </p>
              <button
              onClick={()=>{
                deleteExpenseItemHandeler(item)
              }}
              >
                <FaRegTrashAlt />
              </button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default ViewExpenseModal;
