import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Components
import Dashboard from './components/Dashboard';
import RepositoryList from './components/repository/RepositoryList';
import RepositoryDetail from './components/repository/RepositoryDetail';
import AnalysisList from './components/analysis/AnalysisList';
import AnalysisDetail from './components/analysis/AnalysisDetail';
import RiskConfigList from './components/config/RiskConfigList';
import TestSuggestionList from './components/test/TestSuggestionList';
import Notification from './components/common/Notification';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Context
import { AppProvider } from './context/AppContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});



function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <Sidebar isOpen={isSidebarOpen} />
            <main className="pt-16 pb-16 lg:pl-64 min-h-screen">
              <div className="p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/repositories" element={<RepositoryList />} />
                  <Route path="/repositories/:id" element={<RepositoryDetail />} />
                  <Route path="/analyses" element={<AnalysisList />} />
                  <Route path="/analyses/:id" element={<AnalysisDetail />} />
                  <Route path="/risk-configs" element={<RiskConfigList />} />
                  <Route path="/test-suggestions/:analysisId" element={<TestSuggestionList />} />
                </Routes>
              </div>
            </main>
            <Notification />
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
