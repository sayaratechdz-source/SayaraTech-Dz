import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('Error caught by ErrorBoundary:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 20 }}>حدث خطأ داخل التطبيق. تحقق من الكونسول للمزيد من التفاصيل.</div>;
    }
    return this.props.children;
  }
}
