"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Brody from "../app/IMG_0899.jpg";
interface Counter {
  id: number;
  label: string;
  value: number;
}

const apiUrl = "https://ruvimserver.ddns.net";

export default function Home() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPersonName, setNewPersonName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCounters();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const auth = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setIsEdit(true);
        setPassword("");
        window.scrollTo(0, 0);
      } else if (response.status === 401) {
        setIsEdit(false);
        setErrorMessage("Incorrect Password");
        window.scrollTo(0, 9999);
      } else {
        setIsEdit(false);
        setErrorMessage(response.statusText);
      }
    } catch (error) {
      setErrorMessage(`Error submitting password: ${error}`);
    }
  };

  const fetchCounters = async () => {
    try {
      const response = await fetch(`${apiUrl}/counters`);
      const data = await response.json();
      setCounters(data);
    } catch (error) {
      console.error("Error fetching counters:", error);
    } finally {
      setLoading(false);
    }
  };

  const incrementCounter = async (id: number) => {
    try {
      await fetch(`${apiUrl}/increment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchCounters();
    } catch (error) {
      console.error("Error incrementing counter:", error);
    }
  };

  const decrementCounter = async (id: number) => {
    try {
      await fetch(`${apiUrl}/decrement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchCounters();
    } catch (error) {
      console.error("Error incrementing counter:", error);
    }
  };

  const addPerson = async () => {
    if (!newPersonName.trim()) return;

    try {
      await fetch(`${apiUrl}/add-person`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newPersonName }),
      });
      setNewPersonName("");
      fetchCounters();
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  const removePerson = async (id: number) => {
    try {
      await fetch(`${apiUrl}/remove-person`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchCounters();
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  useEffect(() => {
    fetchCounters();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-cyan-400"></div>
      </div>
    );
  }

  return (
    <>
      <Image
        src={Brody}
        alt="Brody"
        className={`w-[25vw] absolute`}
        style={{
          left: `${Math.floor(Math.random() * 75)}vw`,
          top: `${Math.floor(Math.random() * 67)}vh`,
        }}
      />
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-5 w-96">
          <h1 className="text-3xl font-extrabold mb-10 text-slate-200">
            Death Counter
          </h1>
          <div className="mb-5"></div>
          <div className="text-start">
            {counters
              .sort((a, b) => a.value - b.value)
              .map((counter) => (
                <div key={counter.id} className="my-10 flex">
                  {isEdit ? (
                    <button
                      className="w-14 h-10 my-auto text-slate-200 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 mr-2 transition"
                      onClick={() => removePerson(counter.id)}
                    >
                      &#x2716;
                    </button>
                  ) : null}
                  <div className="font-extrabold my-auto flex text-slate-200">
                    {counter.label}:
                  </div>
                  <div className="flex justify-end w-full">
                    {isEdit ? (
                      <button
                        onClick={() => decrementCounter(counter.id)}
                        className="w-10 h-10 my-auto text-lg mr-2 text-slate-200 cursor-pointer bg-red-600 rounded-md active:bg-red-700 hover:bg-red-500 transition"
                      >
                        -
                      </button>
                    ) : null}
                    <div className="w-12 h-12 text-white bg-slate-800 opacity-80 rounded-md justify-center items-center flex mr-2">
                      {counter.value}
                    </div>
                    {isEdit ? (
                      <button
                        onClick={() => incrementCounter(counter.id)}
                        className="w-10 h-10 my-auto text-slate-200 text-lg cursor-pointer bg-green-600 rounded-md active:bg-green-700 hover:bg-green-500 transition"
                      >
                        +
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            {isEdit ? (
              <>
                <div className="flex justify-center items-center">
                  <input
                    type="text"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    placeholder="Enter person name"
                    className="text-slate-200 bg-slate-800 p-2 rounded-full mr-2 outline-none pl-4"
                  />
                  <button
                    onClick={addPerson}
                    className="h-10 w-full cursor-pointer bg-emerald-600 text-slate-200 rounded-full active:bg-emerald-700 hover:bg-emerald-500 transition"
                  >
                    Add Person
                  </button>
                </div>
                <div className="flex">
                  <button
                    className="px-5 py-2 bg-blue-600 rounded-full text-slate-200 hover:bg-blue-500 active:bg-blue-700 transition mt-10 mx-auto"
                    onClick={() => {
                      setIsEdit(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Done
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
      {errorMessage ? (
        <div className="bg-red-500 bg-opacity-50 p-2 flex justify-center text-slate-200 w-fit mx-auto rounded-full">
          {errorMessage}
        </div>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          auth();
        }}
      >
        <input
          className="flex mx-auto mb-10 mt-5 text-slate-200 bg-slate-800 border-none p-2 rounded-full pl-4 outline-none"
          placeholder="Password"
          type="password"
          value={password || ""}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorMessage("");
          }}
        ></input>
      </form>
    </>
  );
}
