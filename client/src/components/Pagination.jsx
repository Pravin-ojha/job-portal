import React from 'react';
import { Box, Pagination, Stack, Typography } from '@mui/material';

const PaginationComponent = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3 }}>
      <Stack alignItems="center" spacing={2}>
        <Typography variant="body2" color="textSecondary">
          Showing page {currentPage} of {totalPages} ({totalItems} total items)
        </Typography>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => onPageChange(value)}
          color="primary"
          size="large"
        />
      </Stack>
    </Box>
  );
};

export default PaginationComponent;
