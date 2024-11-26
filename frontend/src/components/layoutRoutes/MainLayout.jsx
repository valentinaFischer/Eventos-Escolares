import React from "react";
import { Outlet } from "react-router";

export default function MainLayout(){
   return <>
      <div>
         <header>
            <p>Aqui vai o header</p>
         </header>
         <div>
            <Outlet /> {/* aqui vai ser onde vai os filho */}
         </div>
         <footer>
            <p>Aqui vai o footer</p>
         </footer>
      </div>
   </>
}