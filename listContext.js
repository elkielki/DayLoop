import { createContext, useState, useEffect } from 'react';

export const ListContext = createContext({});

export function ListContextProvider({children}) {
    const initialRoutineListData = [
        {
          title: "Routine 1",
          exercises: [
            { title: "Stretch", timer: 600}, 
            { title: "Push ups", timer: 600 },
            { title: "Break", timer: 300 },
            { title: "Sit ups", timer: 600 },
            { title: "Push ups", timer: 600 },
            { title: "Break", timer: 300 },
            { title: "Sit ups", timer: 600 },
          ],
        },
        {
          title: "Routine 2", 
          exercises: [
            { title: "Walk", timer: 600 },
            { title: "Break", timer: 300 },
            { title: "Sprint", timer: 600 },
            { title: "Break", timer: 600 },
            { title: "Walk", timer: 600 },
            { title: "Break", timer: 300 },
            { title: "Sprint", timer: 600 },
            { title: "Break", timer: 600 },
            { title: "Cooldown Stretch", timer: 600 },
          ],
        }
    ];

    const [routineList, setRoutineList] = useState(initialRoutineListData);
    const [currentRoutineIdx, setCurrentRoutineIdx] = useState(0);

    return (
        <ListContext.Provider value={{routineList, setRoutineList, currentRoutineIdx, setCurrentRoutineIdx}}>
            {children}
        </ListContext.Provider>
    )
}