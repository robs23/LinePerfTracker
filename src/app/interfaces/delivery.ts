import { DeliveryItem } from './delivery-item';

export interface Delivery {
    DocumentDate: string,
    PurchaseOrder: string,
    DeliveryDate: string,
    Vendor: string,
    CreatedOn: string,
    SelectdItem: DeliveryItem,
    Items: DeliveryItem[]
}
