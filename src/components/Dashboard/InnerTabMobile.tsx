import React from 'react'

export const InnerTabMobile = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode[] | React.ReactNode
}) => {
  return (
    <div className="inner-tab">
      <div className="icon-tab">{children}</div>
      <div className="title">{title}</div>
    </div>
  )
}
