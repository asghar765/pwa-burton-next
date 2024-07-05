'use client';

import React, { useEffect, useState } from 'react';

interface RouteStatus {
    path: string;
    status: string;
}

const Dashboard = () => {
    const [routesStatus, setRoutesStatus] = useState<RouteStatus[]>([]);

    useEffect(() => {
        // Assume fetchRouteStatuses is a function that fetches the route statuses.
        // Here we'll mock this with a setTimeout for demonstration purposes.
        const mockRouteStatuses: RouteStatus[] = [
            { path: "/", status: "Accessible" },
            { path: "/registration", status: "Accessible" },
            { path: "/nonexistent", status: "Inaccessible" },
        ];

        setTimeout(() => setRoutesStatus(mockRouteStatuses), 1000);
    }, []);

    return (
        <div>
            <h1>Dashboard - Route Statuses</h1>
            <ul>
                {routesStatus.map((route, index) => (
                    <li key={index}>{route.path} - {route.status}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
