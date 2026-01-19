import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes/paths";

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const goToProducts = (searchTerm: string) => {
    navigate(`${PATHS.PRODUCTS}?search=${encodeURIComponent(searchTerm)}`);
  };

  return {
    goToProducts,
  };
};