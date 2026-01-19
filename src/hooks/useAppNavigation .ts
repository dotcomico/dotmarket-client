import { useNavigate } from "react-router-dom";
import { PATHS, buildPath } from "../routes/paths";

export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    goToProducts: (searchTerm?: string) => {
      navigate(searchTerm ? buildPath.productsWithSearch(searchTerm) : PATHS.PRODUCTS);
    },
    goBack: () => navigate(-1),
  };
};