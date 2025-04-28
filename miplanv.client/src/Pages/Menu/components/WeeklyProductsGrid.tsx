import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { ProductItem } from "./ProductItem";
import { CurrentPackedLunch } from "../../../models/packedLunch";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1 
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 50 }
  }
};

interface WeeklyProductsGridProps
{
    products: CurrentPackedLunch[]
}

export const WeeklyProductsGrid: React.FC<WeeklyProductsGridProps> = ({products} : WeeklyProductsGridProps) => {
    return (
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 4,
          justifyContent: 'center',
          mt: 6
        }}
      >
        {products.length > 0 ? products.map((product, index) => (
          <Box 
            key={index}
            component={motion.div}
            variants={itemVariants}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <ProductItem
              name={product.name}
              image={product.image}
              description={product.description}
              isVegan={product.isVegan}
            />
          </Box>
        )) : (<Typography>Menu inexistente</Typography>)}
      </Box>
    );
  };