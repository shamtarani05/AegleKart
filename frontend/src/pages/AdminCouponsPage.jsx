import React, { useState } from 'react';
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Calendar
} from 'lucide-react';
import useAuthStore from '../stores/auth-store';
import AdminSidebar from '../components/admin/AdminSidebar';
import styles from '../styles/adminCoupons.module.css';

const AdminCouponsPage = () => {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state for adding new coupon
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage', // percentage or fixed
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    validFrom: '',
    validUntil: '',
    description: '',
    usageLimit: ''
  });
  
  // Mock coupons data - in a real app, fetch from API
  const [coupons, setCoupons] = useState([
    {
      id: 'CPN001',
      code: 'WELCOME20',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 500,
      maxDiscount: 200,
      validFrom: '2023-11-01',
      validUntil: '2023-12-31',
      description: 'Welcome discount for new users',
      usageLimit: 1,
      status: 'active'
    },
    {
      id: 'CPN002',
      code: 'SUMMER15',
      discountType: 'percentage',
      discountValue: 15,
      minOrderValue: 800,
      maxDiscount: 300,
      validFrom: '2023-06-01',
      validUntil: '2023-09-30',
      description: 'Summer season discount',
      usageLimit: 0, // Unlimited
      status: 'expired'
    },
    {
      id: 'CPN003',
      code: 'FLAT100',
      discountType: 'fixed',
      discountValue: 100,
      minOrderValue: 1000,
      maxDiscount: 100,
      validFrom: '2023-11-15',
      validUntil: '2024-01-15',
      description: 'Flat discount on medicines',
      usageLimit: 0,
      status: 'active'
    }
  ]);
  
  // Handle input change for coupon form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCouponForm({
      ...couponForm,
      [name]: value
    });
  };
  
  // Generate a unique coupon ID
  const generateCouponId = () => {
    return 'CPN' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!couponForm.code || !couponForm.discountValue || !couponForm.validFrom || !couponForm.validUntil) {
      alert('Please fill all required fields');
      return;
    }
    
    // Prepare new coupon data
    const newCoupon = {
      id: generateCouponId(),
      ...couponForm,
      discountValue: Number(couponForm.discountValue),
      minOrderValue: Number(couponForm.minOrderValue) || 0,
      maxDiscount: Number(couponForm.maxDiscount) || 0,
      usageLimit: Number(couponForm.usageLimit) || 0,
      status: new Date(couponForm.validUntil) >= new Date() ? 'active' : 'expired'
    };
    
    // Add new coupon to the list
    setCoupons([...coupons, newCoupon]);
    
    // Reset form
    setCouponForm({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderValue: '',
      maxDiscount: '',
      validFrom: '',
      validUntil: '',
      description: '',
      usageLimit: ''
    });
    
    // Hide the form
    setShowAddForm(false);
  };
  
  // Delete coupon
  const handleDeleteCoupon = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter(coupon => coupon.id !== id));
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
                    <label htmlFor="discountValue">
                      Discount {couponForm.discountType === 'percentage' ? '(%)' : '(₹)'} *
                    </label>
                    <input
                      type="number"
                      id="discountValue"
                      name="discountValue"
                      value={couponForm.discountValue}
                      onChange={handleInputChange}
                      className={styles.formControl}
                      placeholder={couponForm.discountType === 'percentage' ? "e.g. 10" : "e.g. 100"}
                      min="0"
                      max={couponForm.discountType === 'percentage' ? "100" : ""}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="minOrderValue">Min. Order Value (₹)</label>
                    <input
                      type="number"
                      id="minOrderValue"
                      name="minOrderValue"
                      value={couponForm.minOrderValue}
                      onChange={handleInputChange}
                      className={styles.formControl}
                      placeholder="e.g. 500"
                      min="0"
                    />
                  </div>
                  
                  {couponForm.discountType === 'percentage' && (
                    <div className={styles.formGroup}>
                      <label htmlFor="maxDiscount">Max Discount (₹)</label>
                      <input
                        type="number"
                        id="maxDiscount"
                        name="maxDiscount"
                        value={couponForm.maxDiscount}
                        onChange={handleInputChange}
                        className={styles.formControl}
                        placeholder="e.g. 200"
                        min="0"
                      />
                    </div>
                  )}
                  
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
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="usageLimit">Usage Limit (0 = unlimited)</label>
                    <input
                      type="number"
                      id="usageLimit"
                      name="usageLimit"
                      value={couponForm.usageLimit}
                      onChange={handleInputChange}
                      className={styles.formControl}
                      placeholder="e.g. 1"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className={styles.formGroupFull}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={couponForm.description}
                    onChange={handleInputChange}
                    className={`${styles.formControl} ${styles.textarea}`}
                    placeholder="Describe the coupon purpose"
                    rows="2"
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
                  <th>Status</th>
                  <th>Usage Limit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan="8" className={styles.noCoupons}>
                      No coupons found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td className={styles.couponCodeCell}>
                        <span className={styles.couponCode}>{coupon.code}</span>
                        {coupon.description && (
                          <span className={styles.couponDescription}>{coupon.description}</span>
                        )}
                      </td>
                      <td>
                        {coupon.discountType === 'percentage' ? 
                          `${coupon.discountValue}% ${coupon.maxDiscount ? `(max ₹${coupon.maxDiscount})` : ''}` : 
                          `₹${coupon.discountValue}`
                        }
                      </td>
                      <td>{coupon.minOrderValue ? `₹${coupon.minOrderValue}` : '-'}</td>
                      <td>{formatDate(coupon.validFrom)}</td>
                      <td>{formatDate(coupon.validUntil)}</td>
                      <td>
                        <span className={`${styles.couponStatus} ${styles[coupon.status]}`}>
                          {coupon.status === 'active' ? 'Active' : 'Expired'}
                        </span>
                      </td>
                      <td>{coupon.usageLimit === 0 ? 'Unlimited' : coupon.usageLimit}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.actionButton}
                            title="Edit Coupon"
                            onClick={() => alert('Edit coupon: ' + coupon.code)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            title="Delete Coupon"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
