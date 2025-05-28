import React, { useState, useEffect } from 'react';
import { 
  Search,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import useAuthStore from '../stores/auth-store';
import AdminSidebar from '../components/admin/AdminSidebar';
import styles from '../styles/adminCoupons.module.css';

const AdminCouponsPage = () => {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Updated form state to match schema
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    discount: '',
    description: '',
    minOrder: '',
    validFrom: '',
    validUntil: ''
  });

  const [coupons, setCoupons] = useState([]);

  // Fetch coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/coupons');
      if (!response.ok) throw new Error('Failed to fetch coupons');
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  // Handle input change for coupon form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCouponForm({
      ...couponForm,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const couponData = {
        code: couponForm.code.toUpperCase(),
        discountType: couponForm.discountType,
        value: parseFloat(couponForm.discount), // Changed from discount to value
        description: couponForm.description,
        minOrder: parseFloat(couponForm.minOrder),
        validFrom: couponForm.validFrom,
        validUntil: couponForm.validUntil,
        isActive: true
      };

      const response = await fetch('http://localhost:3000/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create coupon');
      }
      
      const newCoupon = await response.json();
      setCoupons([newCoupon, ...coupons]);
      setShowAddForm(false);
      
      // Reset form
      setCouponForm({
        code: '',
        discountType: 'percentage',
        discount: '',
        description: '',
        minOrder: '',
        validFrom: '',
        validUntil: ''
      });
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert(error.message);
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/coupons/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete coupon');
        setCoupons(coupons.filter(coupon => coupon._id !== id));
      } catch (error) {
        console.error('Error deleting coupon:', error);
        alert(error.message);
      }
    }
  };

  // Filter coupons based on search
  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className={styles.adminPageContainer}>
      <div className={styles.adminContentWrapper}>
        <AdminSidebar user={user} />
        
        <main className={styles.adminMainContent}>
          {/* Header */}
          <div className={styles.adminHeader}>
            <h1>Discount Coupons</h1>
            <div className={styles.adminActions}>
              <button 
                className={styles.addButton}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? (
                  <>
                    <X size={16} />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Add Coupon</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Add Coupon Form */}
          {showAddForm && (
            <div className={styles.formContainer}>
              <h2 className={styles.formTitle}>Add New Coupon</h2>
              <form onSubmit={handleSubmit} className={styles.couponForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="code">Coupon Code*</label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={couponForm.code}
                      onChange={handleInputChange}
                      className={styles.formControl}
                      placeholder="e.g. SUMMER20"
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="discountType">Discount Type*</label>
                    <select
                      id="discountType"
                      name="discountType"
                      value={couponForm.discountType}
                      onChange={handleInputChange}
                      className={styles.formControl}
                      required
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="name">
                      Discount {couponForm.discountType === 'percentage' ? '(%)' : '(₹)'} *
                    </label>
                    <input
                      type="number"
                      id="value"
                      name="discount"
                      value={couponForm.discount}
                      onChange={handleInputChange}
                      className={styles.formControl}
                      placeholder={couponForm.discountType === 'percentage' ? "e.g. 10" : "e.g. 100"}
                      min="0"
                      max={couponForm.discountType === 'percentage' ? "100" : ""}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="minOrder">Min. Order Value (₹)</label>
                    <input
                      type="number"
                      id="minOrder"
                      name="minOrder"
                      value={couponForm.minOrder}
                      onChange={handleInputChange}
                      className={styles.formControl}
                      placeholder="e.g. 500"
                      min="0"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="validFrom">Valid From*</label>
                    <input
                      type="date"
                      id="validFrom"
                      name="validFrom"
                      value={couponForm.validFrom}
                      onChange={handleInputChange}
                      className={styles.formControl}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="validUntil">Valid Until*</label>
                    <input
                      type="date"
                      id="validUntil"
                      name="validUntil"
                      value={couponForm.validUntil}
                      onChange={handleInputChange}
                      className={styles.formControl}
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formGroupFull}>
                  <label htmlFor="description">Description*</label>
                  <textarea
                    id="description"
                    name="description"
                    value={couponForm.description}
                    onChange={handleInputChange}
                    className={`${styles.formControl} ${styles.textarea}`}
                    placeholder="Describe what this coupon offers"
                    rows="2"
                    required
                  ></textarea>
                </div>
                
                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelButton} onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Add Coupon
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Search coupons by code or description..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Coupons Table */}
          <div className={styles.couponsTableContainer}>
            <table className={styles.couponsTable}>
              <thead>
                <tr>
                  <th>Coupon Code</th>
                  <th>Discount</th>
                  <th>Min. Order</th>
                  <th>Valid From</th>
                  <th>Valid Until</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.noCoupons}>
                      No coupons found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <tr key={coupon._id}>
                      <td className={styles.couponCodeCell}>
                        <span className={styles.couponCode}>{coupon.code}</span>
                        <span className={styles.couponDescription}>{coupon.description}</span>
                      </td>
                      <td>
                        {coupon.discountType === 'percentage' ? 
                          `${coupon.value}%` : 
                          `PKR ${coupon.value}`
                        }
                      </td>
                      <td>PKR {coupon.minOrder}</td>
                      <td>{formatDate(coupon.validFrom)}</td>
                      <td>{formatDate(coupon.validUntil)}</td>
                      <td>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteCoupon(coupon._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCouponsPage;
