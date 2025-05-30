import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, useMediaQuery, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const TradeModal = ({ open, handleClose, tradeType, stockName, stockPrice, orderDetails }) => {
  const [quantity, setQuantity] = useState(orderDetails ? orderDetails.quantity : 1);
  const [total, setTotal] = useState(orderDetails ? orderDetails.total : stockPrice);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setQuantity(newQuantity);
    setTotal((newQuantity * stockPrice).toFixed(2));
  };
  
  const handleSubmit = () => {
    // Prepare the order data
    const orderData = {
      name: stockName,
      qty: quantity,
      price: stockPrice,
      mode: tradeType,
      orderType: orderDetails ? orderDetails.orderType : 'market',
      limitPrice: orderDetails?.limitPrice || stockPrice,
      triggerPrice: orderDetails?.triggerPrice || null,
      total: parseFloat(total)
    };
    
    // Send the order to the server
    axios.post('http://localhost:3000/new-order', orderData)
      .then((res) => {
        console.log(res.data);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="trade-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {
          xs: '90%', 
          sm: '450px',
          md: '500px',
          lg: '550px'
        },
        maxHeight: {
          xs: '90vh',
          sm: '80vh'
        },
        overflowY: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 2,
      }}>
        <div className="flex justify-between items-center mb-4">
          <Typography 
            id="trade-modal-title" 
            variant={isMobile ? "h6" : "h5"} 
            component="h2"
            sx={{ fontWeight: 'bold' }}
          >
            Confirm {tradeType} Order
          </Typography>
          <CloseIcon 
            onClick={handleClose} 
            className="cursor-pointer" 
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem' },
              padding: '4px',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              {stockName}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              ₹{stockPrice}
            </Typography>
          </div>
          
          {orderDetails && (
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Order Type:</span>
                  <p className="font-medium capitalize">{orderDetails.orderType}</p>
                </div>
                
                {orderDetails.orderType !== 'market' && (
                  <div>
                    <span className="text-gray-600">Limit Price:</span>
                    <p className="font-medium">₹{orderDetails.limitPrice.toFixed(2)}</p>
                  </div>
                )}
                
                {orderDetails.orderType === 'sl' && (
                  <div>
                    <span className="text-gray-600">Trigger Price:</span>
                    <p className="font-medium">₹{orderDetails.triggerPrice.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ 
              min: 1,
              style: { fontSize: isMobile ? '1rem' : '1.1rem' }
            }}
            sx={{ mt: 1, mb: 1 }}
            disabled={!!orderDetails}
          />
        </div>
        
        <div className="mb-6">
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.2rem' },
              fontWeight: 600,
              mb: 2
            }}
          >
            Total Amount: ₹{total}
          </Typography>
          
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            <p className="text-gray-600 mb-1">
              By placing this order, you agree to our Terms of Service and acknowledge that you have read our Privacy Policy.
            </p>
            <p className="text-gray-600">
              All orders are subject to market conditions and availability.
            </p>
          </div>
        </div>
        
        <Button 
          fullWidth 
          variant="contained" 
          onClick={handleSubmit}
          sx={{
            bgcolor: tradeType === 'Buy' ? '#4caf50' : '#f44336',
            '&:hover': {
              bgcolor: tradeType === 'Buy' ? '#388e3c' : '#d32f2f',
            },
            py: { xs: 1.2, sm: 1.5 },
            fontSize: { xs: '0.9rem', sm: '1rem' },
            mt: 1
          }}
        >
          Confirm {tradeType} Order
        </Button>
      </Box>
    </Modal>
  );
};

export default TradeModal;