import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Row, Col, CardText, Button } from 'reactstrap';
import ShowPackage from './ShowPackage';



export default function Packages() {
	const [listPackages, updatePackages] = useState([]);
	const [sendingPackages, updateSending] = useState([]);
	const [receivingPackages, updateReceiving] = useState([]);

	const [selectedPackage, setSelectedPackage] = useState(null); // to show package details under table

	const handleDetailButtonClick = (pack) => {
		setSelectedPackage(pack);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('package');
				const data = await response.json();
				updatePackages(data);

				const sendingPackagesData = data.filter(pack => pack.sender === 'Andres');
				const receivingPackagesData = data.filter(pack => pack.receiver === 'Andres');

				updateSending(sendingPackagesData); // update useStates with new arrays because pushing could lead to unexpected behavior in react
				updateReceiving(receivingPackagesData);

			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, []); // Empty dependency array ensures useEffect runs once after initial render


	// return data feature conditional rendering such as checking the length of each array, if empty then do not render, else render it
	// probably change the way this data gets displayed so that we can show multiple packages, so... dont use card?
	return (
		<>
			<h1>Packages linked to Account</h1>
			<Row>
				<Col>
				<Card>
					<CardHeader>Sending</CardHeader>
					{sendingPackages.length > 0 && (
						<CardBody>
							<table className="table table-striped" aria-labelledby="tableLabel">
								<thead>
								<tr>
									<th>Tracking Id</th>
									<th>Status</th>
									<th>Reciever</th>
									<th>Package Type</th>
									<th>&nbsp;</th>
									
								</tr>
								</thead>
								<tbody>
								{sendingPackages.map(item =>
									<tr key={item.packageId}>
										<td>{item.trackingNumber === null ? "N/A" : item.trackingNumber}</td>
										<td>{item.status}</td>
										<td>{item.receiver}</td>
										<td>{item.packageType}</td>
										<td><Button color='primary' size='sm' onClick={() => handleDetailButtonClick(item)}>Details</Button></td>
									</tr>
								)}
								</tbody>
							</table>
						</CardBody>
					)}
				</Card>
				</Col>
				<Col>
					<Card>
						<CardHeader>Receiving</CardHeader>
						{
							receivingPackages.length > 0 && (
								<CardBody>
									<CardText>
										<table className="table table-striped" aria-labelledby="tableLabel">
											<thead>
											<tr>
												<th>Tracking Id</th>
												<th>Status</th>
												<th>Sender</th>
												<th>Package Type</th>
												<th>&nbsp;</th>
												
											</tr>
											</thead>
											<tbody>
											{receivingPackages.map(item =>
												<tr key={item.packageId}>
													<td>{item.trackingNumber  === null ? "N/A" : item.trackingNumber}</td>
													<td>{item.status}</td>
													<td>{item.sender}</td>
													<td>{item.packageType}</td>
													<td><Button color='primary' size='sm' onClick={() => handleDetailButtonClick(item)}>Details</Button></td>
												</tr>
											)}
											</tbody>
										</table>
									</CardText>
									
								</CardBody>
							)
						}
					</Card>
				</Col>
			</Row>
			<br></br>
			<Row>
				<Col>
				{selectedPackage && <ShowPackage _package={selectedPackage} />}
				</Col>
			</Row>
		</>
	);
};
