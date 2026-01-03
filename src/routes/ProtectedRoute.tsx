// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth'; // נניח שיש לך הוק שמנהל מצב התחברות

// const ProtectedRoute = () => {
//   const { isLoggedIn, isLoading } = useAuth();
//   const location = useLocation();

//   // בזמן שהאפליקציה בודקת אם יש טוקן תקף (למשל מול ה-LocalStorage)
//   if (isLoading) {
//     return <div>Loading...</div>; // או Spinner מעוצב
//   }

//   // אם המשתמש לא מחובר, נשלח אותו ללוגין
//   // אנחנו שומרים את ה-location כדי שנוכל להחזיר אותו לדף שבו הוא היה אחרי ההתחברות
//   if (!isLoggedIn) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // אם הכל תקין, הצג את רכיבי הבן (הדפים המוגנים)
//   return <Outlet />;
// };

// export default ProtectedRoute;