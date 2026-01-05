import React, { createContext, useContext, useEffect, useState } from 'react';
import { SERVICES, Service } from '../servicesData';

interface ServiceContextType {
    services: Service[];
    activePromoIds: string[];
    loading: boolean;
    error: string | null;
}

const ServiceContext = createContext<ServiceContextType>({
    services: [],
    activePromoIds: [],
    loading: true,
    error: null,
});

export const useServices = () => useContext(ServiceContext);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [services, setServices] = useState<Service[]>(SERVICES);
    const [activePromoIds, setActivePromoIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Fetch dynamic pricing/promo data from API
                const response = await fetch('/api/services');

                if (!response.ok) {
                    throw new Error("Failed to fetch services");
                }

                const data = await response.json();

                // Handle new response structure { services: [], activePromoIds: [] }
                // or fallback for safety (though we just deployed the API)
                const remoteServices = Array.isArray(data) ? data : data.services;
                const remotePromoIds = Array.isArray(data) ? [] : (data.activePromoIds || []);

                setActivePromoIds(remotePromoIds);

                const remoteDataMap = new Map();
                remoteServices.forEach((s: any) => {
                    remoteDataMap.set(s.id, s);
                });

                // Merge local static data with remote dynamic data
                const mergedServices = SERVICES.map(localService => {
                    const remoteData = remoteDataMap.get(localService.id);
                    if (remoteData) {
                        return {
                            ...localService,
                            ...remoteData, // Overwrite dynamic fields (prices, hasPromo, etc.)
                        };
                    }
                    return localService;
                });

                setServices(mergedServices);
            } catch (err) {
                console.error("Error fetching services:", err);
                setError("Failed to load latest pricing. Using default rates.");
                // Fallback to local data is already the initial state
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    return (
        <ServiceContext.Provider value={{ services, activePromoIds, loading, error }}>
            {children}
        </ServiceContext.Provider>
    );
};
