import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CropRecommendation from './pages/smart-farming/CropRecommendation';
import FertilizationPlan from './pages/smart-farming/FertilizationPlan';
import HarvestEstimation from './pages/smart-farming/HarvestEstimation';
import Reports from './pages/Reports';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="smart-farming">
          <Route path="recommendation" element={<CropRecommendation />} />
          <Route path="fertilization" element={<FertilizationPlan />} />
          <Route path="harvest" element={<HarvestEstimation />} />
          <Route path="harvest" element={<HarvestEstimation />} />
        </Route>
        <Route path="reports" element={<Reports />} />
        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
