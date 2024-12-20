"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { swalAlert, swalConfirm } from "../utils";

// Firebase
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { authContext } from "./auth-context";
import { toast } from "react-toastify";

const financeContext = createContext({
  income: [],
  expenses: [],
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
  addExpenseItem: async () => {},
  addCategory: async () => {},
  deleteExpenseItem: async () => {},
});

export default function FinanceContextProvider({ children }) {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const { user } = useContext(authContext);

  const addCategory = async (category) => {
    try {
      const collectionRef = collection(db, "expenses");
      const docSnap = await addDoc(collectionRef, {
        uid: user.uid,
        ...category,
        items: [],
      });
      setExpenses((prevExpenses) => {
        return [
          ...prevExpenses,
          {
            id: docSnap.id,
            uid: user.uid,
            items: [],
            ...category,
          },
        ];
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteExpenseItem = async (updateExpense, expenseCategoryId) => {
    const result = await swalConfirm(
      "Are you sure you want to delete this expense item?",
      "This action cannot be undone."
    );

    if (!result.isConfirmed) {
      console.log("Deletion canceled by the user.");
      return;
    }

    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await updateDoc(docRef, {
        ...updateExpense,
      });

      setExpenses((prevExpenses) => {
        const updatedExpenses = [...prevExpenses];
        const pos = updatedExpenses.findIndex(
          (expense) => expense.id === expenseCategoryId
        );
        updatedExpenses[pos].items = [...updateExpense.items];
        updatedExpenses[pos].total = updateExpense.total;
        return updatedExpenses;
      });

      toast.success("Expense item deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense item:", error.message);
      toast.error(error.message);
      throw error;
    }
  };

  const deleteExpenseCategory = async (expenseCategoryId) => {
    const result = await swalConfirm(
      "Are you sure you want to delete this expense category?",
      "This action cannot be undone."
    );

    if (!result.isConfirmed) {
      console.log("Deletion canceled by the user.");
      return;
    }

    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await deleteDoc(docRef);

      setExpenses((prevExpenses) => {
        const updatedExpenses = prevExpenses.filter(
          (expense) => expense.id !== expenseCategoryId
        );
        return [...updatedExpenses];
      });

      toast.success("Expense category deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense category:", error.message);
      toast.error(error.message);
      throw error;
    }
  };

  const addExpenseItem = async (expenseCategoryId, newExpense) => {
    const docRef = doc(db, "expenses", expenseCategoryId);
    try {
      await updateDoc(docRef, { ...newExpense });

      setExpenses((prevState) => {
        const updatedExpenses = [...prevState];
        const foundIndex = updatedExpenses.findIndex((expense) => {
          return expense.id === expenseCategoryId;
        });
        updatedExpenses[foundIndex] = { id: expenseCategoryId, ...newExpense };
        return updatedExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  const addIncomeItem = async (newIncome) => {
    const collectionRef = collection(db, "income");
    try {
      const docSnap = await addDoc(collectionRef, newIncome);

      setIncome((prevState) => [
        ...prevState,
        { id: docSnap.id, ...newIncome, createdAt: new Date() },
      ]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const removeIncomeItem = async (incomeId) => {
    const result = await swalConfirm(
      "Are you sure you want to delete this income entry?",
      "This action cannot be undone."
    );

    if (!result.isConfirmed) {
      console.log("Deletion canceled by the user.");
      return;
    }

    const docRef = doc(db, "income", incomeId);
    try {
      await deleteDoc(docRef);
      setIncome((prevState) =>
        prevState.filter((income) => income.id !== incomeId)
      );
      toast.success("Income entry deleted successfully!");
    } catch (error) {
      console.error("Error deleting income entry:", error.message);
      toast.error(
        error.message
      );
    }
  };

  const values = {
    income,
    expenses,
    addIncomeItem,
    removeIncomeItem,
    addExpenseItem,
    addCategory,
    deleteExpenseItem,
    deleteExpenseCategory,
  };

  useEffect(() => {
    if (!user) return;

    const getIncomeData = async () => {
      const collectionRef = collection(db, "income");
      const q = query(collectionRef, where("uid", "==", user.uid));
      try {
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
            createdAt: docData.createdAt
              ? docData.createdAt.toDate()
              : new Date(),
          };
        });
        setIncome(data);
      } catch (error) {
        console.error("Error fetching income data:", error.message);
      }
    };

    const getExpensesData = async () => {
      const collectionRef = collection(db, "expenses");
      const q = query(collectionRef, where("uid", "==", user.uid));
      try {
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
            createdAt: docData.createdAt
              ? docData.createdAt.toDate()
              : new Date(),
          };
        });
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expense data:", error.message);
      }
    };

    getIncomeData();
    getExpensesData();
  }, [user]);

  return (
    <financeContext.Provider value={values}>{children}</financeContext.Provider>
  );
}
export { financeContext };
