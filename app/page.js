"use client";
import ExpenseCategoryItem from "@/components/ExpenseCategoryItem";
import AddExpensesModal from "@/components/modals/AddExpensesModal";
import AddIncomeModal from "@/components/modals/AddIncomeModal";
import SignIn from "@/components/SignIn";
import { authContext } from "@/lib/store/auth-context";
import { financeContext } from "@/lib/store/finance-context";
import { currencyFormatter, swalAlert, swalConfirm } from "@/lib/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState, useContext, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";




ChartJS.register(ArcElement, Tooltip, Legend);



export default function Home() {
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpensesModal, setShowAddExpensesModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const {expenses, income} = useContext(financeContext)
  const {user} = useContext(authContext)

 
useEffect(() => {
  
const newBalance = income.reduce((total,i) =>{
  return total + i.amount
},0)
  expenses.reduce((total, e) =>{
    return total + e.amount
  }, 0)

  setBalance(newBalance)
}, [expenses, income])

if (!user){
  return <SignIn/>
}

  return (
    <>
      {/* Add Income Modal */}
     <AddIncomeModal show={showAddIncomeModal} onClose={setShowAddIncomeModal}/>
      {/* Add Expenses Modal */}
     <AddExpensesModal show={showAddExpensesModal} onClose={setShowAddExpensesModal}/>

      <main className="container max-w-2xl px-6 py-6 mx-auto">
        <section>
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(balance)}</h2>
        </section>
        <section className="flex items-center gap-2 py-3">
          <button
            onClick={() => setShowAddExpensesModal(true)}
            className="btn btn-primary"
          >
            + Expenses
          </button>
          <button
            onClick={() => setShowAddIncomeModal(true)}
            className="btn btn-primary-outline"
          >
            + Income
          </button>
        </section>
        {/* Expenses */}
        <section className="py-3">
          <h3 className="text-2xl ">My Expenses</h3>
          <div className="flex flex-col gap-4 mt-6">
            {expenses.map((expense) => (
              <ExpenseCategoryItem
                key={expense.id}
                expense={expense}
              />
            ))}
          </div>
        </section>
        {/* Chart section */}
        <section className="py-6">
          <a id="stats" />
          <h3 className="text-2xl">Stats</h3>
          <div className="w-1/2 mx-auto">
            <Doughnut
              data={{
                labels: expenses.map((expense) => expense.title),
                datasets: [
                  {
                    label: "Expenses",
                    data: expenses.map((expense) => expense.total),
                    backgroundColor: expenses.map((expense) => expense.color),
                    borderColor: expenses.map((expense) => expense.color),
                    borderWidth: 5,
                  },
                ],
              }}
            />
          </div>
        </section>
      </main>
    </>
  );
}
