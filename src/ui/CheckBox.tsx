import React, { useState } from 'react';

interface CheckboxProps {
    label: string;
    onChange?: (checked: boolean) => void;
}

function Checkbox({ label, onChange }: CheckboxProps) {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
        onChange?.(event.target.checked);
    };

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                {label}
            </label>
        </div>
    );
}

export default Checkbox;