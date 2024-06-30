interface flatCharacteristics {
    characteristicId: string;
    characteristicName: string;
    valueId: string;
    value: string;
}
interface Category {
    id: string;
    name: string;
}

export interface FlattenProduct {
    id: string;
    name: string;
    imgUrl: string;
    categories: Category[];
    characteristics: flatCharacteristics[];
    price: string;
}
